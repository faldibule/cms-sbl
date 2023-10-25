import { useCallback, useMemo, useState } from 'react'
import { Button, Card, CardContent, Checkbox, Container, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import CustomSearchComponent from '@components/CustomSearchComponent';
import { LoadingButton } from '@mui/lab';
import Loading from '@components/Loading';
import DeleteDialog from '@components/DeleteDialog';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import useFetchItemCategory from '@hooks/item-category/useFetchItemCategory';
import useDeleteItemCategory from '@hooks/item-category/useDeleteItemCategory';
import useSaveItemCategory from '@hooks/item-category/useSaveItemCategory';
import ImportModal from '@components/ImportModal';
import Iconify from '@components/Iconify';

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchItemCategory(params)
    const { data: parentCategories, refetch: refetchParentCategories, isLoading: loadingParent  } = useFetchItemCategory({ paginate: 0, only_parent: 1 })
    const handleChangePage = (event, newPage) => {
        setParams((prev) => {
            return {
                ...prev,
                page: newPage + 1,
            };
        });
    };
    const handleChangeRowsPerPage = (event) => {
        setParams((prev) => {
            return {
                ...prev,
                page: 1,
                limit: +event.target.value,
            };
        });
    };
    
    const [loading, setLoading] = useState(false)
    const [staging, setStaging] = useState({})
    const handleReset = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging({})
            setLoading(false)
        }, 0);
    }
    const handleEdit = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging(data)
            setLoading(false)
        }, 500);
    }
    
    const [open, setOpen] = useState(false)
    const handleClose = (id = null) => {
        if(open){
            handleReset()
        }
        setOpen(!open)
        if(!!!id) return;
        setStaging({ id })
    }

    const refreshData = () => {
        handleReset()
        refetch()
        refetchParentCategories()
    }
    const { mutate: deleteDepartment, isLoading: loadingDelete } = useDeleteItemCategory({
        onSuccess: () => {
            refreshData()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteDepartment(staging?.id)
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveItemCategory({
        onSuccess: () => {
            refreshData()
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        save({ formData, id: staging?.id })
    }

    const [modalImport, setModalImport] = useState(false)
    const handleModalImport = () => setModalImport(!modalImport)

    if(isFetchedAfterMount && params.page !== 1 && rows !== undefined && rows?.data.length === 0){
        setParams({ ...params, page: rows.meta.last_page })
    }

    const renderData = useCallback(() => {
        if(rows === undefined) {
            return (
                <TableRow>
                    <TableCell
                        component="th"
                        scope="row"
                        sx={{
                            textAlign: "center",
                            py: 5,
                        }}
                        colSpan={10}
                    >
                        <Loading />
                    </TableCell>
                </TableRow>
            )
        } 
        if(rows.data.length === 0){
            return (
                <TableRow>
                    <TableCell
                        component="th"
                        scope="row"
                        sx={{
                            textAlign:
                                "center",
                            py: 10,
                        }}
                        colSpan={10}
                    >
                        No result found
                        {params.search !==
                            "" && (
                            <div
                                style={{
                                    display:
                                        "inline-block",
                                }}
                            >
                                &nbsp;for "<b>{params.search}</b>"
                            </div>
                        )}
                        .
                    </TableCell>
                </TableRow>
            )
        }
        return rows.data.map((value, key) => (
            <TableRow key={key}>
                <TableCell
                    component="th"
                    scope="row"
                    align="center"
                >
                    {rows.meta.from+key}.
                </TableCell>
                <TableCell>
                    {value.category_code}
                </TableCell>
                <TableCell>
                    {value.category}
                </TableCell>
                <TableCell>
                    {value?.parent_category?.category || '-'}
                </TableCell>
                <TableCell>
                    <CustomActionTableComponent 
                        edit={true}
                        handleEdit={() => handleEdit(value)}
                        handleDelete={() => handleClose(value.id)}
                    />
                </TableCell>                                                             
            </TableRow>
        ))
    }, [rows])   

    const renderParentCategory = useCallback(() => {
        if(loadingParent) return null;
        const filteredData = parentCategories.data.filter(v => {
            if(!!staging.id){
                return v.id !== staging.id
            }
            return true
        })
        if(filteredData.length === 0 ){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return filteredData.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.category_code} - {v.category}</MenuItem>
            )
        })
    }, [loadingParent, parentCategories, staging])

    return (
        <Page title='Item Category'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack justifyContent='space-between' mb={3} direction='row' alignitems='center'>
                            <Stack>
                                <Typography variant='h4'>
                                    Item Category
                                </Typography>
                            </Stack>
                            {/* <Button variant='contained' onClick={handleModalImport} startIcon={<Iconify icon='uil:import' />}>Import</Button> */}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                    <Grid item xs={12} md={12}>
                                        <CustomSearchComponent 
                                            params={params}
                                            search={params.search}
                                            setParams={setParams}
                                        />
                                    </Grid>
                                </Grid>
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                }}
                                            >
                                                <TableCell>No.</TableCell>
                                                <TableCell>Code</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Parent</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {renderData()}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {rows !== undefined && rows.data.length > 0 && (
                                    <TablePagination
                                        component="div"
                                        count={rows.meta.total}
                                        page={params.page - 1}
                                        rowsPerPage={params.limit}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage
                                        }
                                        rowsPerPageOptions={[
                                            1, 5, 10, 25, 50, 100,
                                        ]}
                                        showFirstButton
                                        showLastButton
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2 }}>
                            <Typography mb={3} variant='h6'>
                                {!!staging.id ? 'Form Edit Item Category' : 'Form Add Item Category'}
                            </Typography>
                            {!loading ? 
                                <Stack rowGap={2} component='form' onSubmit={onSubmit}>
                                    <TextField
                                        fullWidth 
                                        label='Code'
                                        name='category_code'
                                        defaultValue={staging?.category_code}
                                        required
                                        helperText={!!errors?.category_code && errors?.category_code[0]}
                                        error={!!errors?.category_code}
                                    /> 
                                    <TextField
                                        fullWidth 
                                        label='Name'
                                        name='category'
                                        defaultValue={staging?.category}
                                        required
                                        helperText={!!errors?.category && errors?.category[0]}
                                        error={!!errors?.category}
                                    /> 
                                    <TextField
                                        fullWidth 
                                        label='Parent'
                                        select
                                        name='parent_category_id'
                                        defaultValue={staging?.parent_category?.id}
                                        helperText={!!errors?.parent_category_id && errors?.parent_category_id[0]}
                                        error={!!errors?.parent_category_id}
                                        disabled={loadingParent}
                                    >
                                        <MenuItem value=''>None</MenuItem>
                                        {renderParentCategory()}
                                    </TextField> 
                                    <Stack direction='row' spacing={2}>
                                        <LoadingButton loading={loadingSave} fullWidth variant='contained' type='submit'>
                                            Submit
                                        </LoadingButton>
                                        <Button variant='outlined' onClick={handleReset} fullWidth>Reset</Button>
                                    </Stack>
                                </Stack>
                            : <Loading />
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <DeleteDialog 
                            handleClose={handleClose}
                            handleDelete={handleDelete}
                            open={open}
                            loading={loadingDelete}
                        />
                        <ImportModal 
                            handleClose={handleModalImport}
                            open={modalImport}
                            title='Item Category'
                            url={'item-category/import'}
                            refreshData={refreshData}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;