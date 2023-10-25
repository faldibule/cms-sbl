import { useCallback, useMemo, useState } from 'react'
import { Button, Card, CardContent, Checkbox, Container, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import CustomSearchComponent from '@components/CustomSearchComponent';
import { LoadingButton } from '@mui/lab';
import Loading from '@components/Loading';
import DeleteDialog from '@components/DeleteDialog';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct';
import useDeleteItemProduct from '@hooks/item-product/useDeleteItemProduct';
import useSaveItemProduct from '@hooks/item-product/useSaveItemProduct';
import useFetchItemCategory from '@hooks/item-category/useFetchItemCategory';
import useFetchUnit from '@hooks/unit/useFetchUnit';

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchItemProduct(params)

    // Unit 
    const { data: unitData, isLoading: loadingUnit } = useFetchUnit({ paginate: 0 })

    // Category & Sub Category
    const [category, setCategory] = useState('')
    const { data: itemCategory, isLoading: loadingCategory } = useFetchItemCategory({ paginate: 0 })
    const handleCategory = (e) => setCategory(e.target.value)
    const filteredDataParentCategory = useMemo(() => {
        const temp = itemCategory?.data.filter(v => {
            return !!!v.parent_category?.id
        })
        return !!temp ? temp : []
    }, [itemCategory]) 
    const filteredDataChildCategory = useMemo(() => {
        if(category === '') return []
        const temp = itemCategory?.data.filter(v => {
            return !!v.parent_category?.id && v.parent_category?.id === category
        })
        return !!temp ? temp : []
    }, [itemCategory, category]) 
    const renderInputParentCategory = () => {
        if(filteredDataParentCategory.length === 0){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return filteredDataParentCategory.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.category_code} - {v.category}</MenuItem>
            )
        })
    }
    const renderInputChildCategory = () => {
        if(filteredDataChildCategory.length === 0){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return filteredDataChildCategory.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.category_code} - {v.category}</MenuItem>
            )
        })
    }

    // Handle Page
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
    
    // Handle Action
    const [loading, setLoading] = useState(false)
    const [staging, setStaging] = useState({})
    const handleReset = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging({})
            setCategory('')
            setLoading(false)
        }, 0);
    }
    const handleEdit = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging(data)
            setCategory(data.item_category.id)
            setLoading(false)
        }, 500);
    }
    
    // Handle Dialog Delete
    const [open, setOpen] = useState(false)
    const handleClose = (id = null) => {
        if(open){
            handleReset()
        }
        setOpen(!open)
        if(!!!id) return;
        setStaging({ id })
    }
    const { mutate: deleteDepartment, isLoading: loadingDelete } = useDeleteItemProduct({
        onSuccess: () => {
            handleReset()
            refetch()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteDepartment(staging?.id)
    }

    // HandleSubmit
    const { mutate: save, isLoading: loadingSave, error } = useSaveItemProduct({
        onSuccess: () => {
            handleReset()
            refetch()
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        save({ formData, id: staging?.id })
    }

    // HandleTable
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
                    {value.code}
                </TableCell>
                <TableCell>
                    {value.name}
                </TableCell>
                <TableCell>
                    {value.tax}
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

    const renderUnitMenuItem = useCallback(() => {
        if(loadingUnit) return null
        if(unitData.length === 0 ){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return unitData.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.param}</MenuItem>
            )
        })

    }, [unitData])

    return (
        <Page title='Item Product'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Item Product
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={7}>
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
                                                <TableCell>Tax</TableCell>
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
                    <Grid item xs={12} md={5}>
                        <Card sx={{ p: 2 }}>
                            <Typography mb={3} variant='h6'>
                                {!!staging.id ? 'Form Edit Item Product' : 'Form Add Item Product'}
                            </Typography>
                            {!loading ? 
                                <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Code'
                                            name='code'
                                            defaultValue={staging?.code}
                                            required
                                            helperText={!!errors?.code && errors?.code[0]}
                                            error={!!errors?.code}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Name'
                                            name='name'
                                            defaultValue={staging?.name}
                                            required
                                            helperText={!!errors?.name && errors?.name[0]}
                                            error={!!errors?.name}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Brand'
                                            name='brand'
                                            defaultValue={staging?.brand}
                                            required
                                            helperText={!!errors?.brand && errors?.brand[0]}
                                            error={!!errors?.brand}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Size'
                                            name='size'
                                            defaultValue={staging?.size}
                                            required
                                            helperText={!!errors?.size && errors?.size[0]}
                                            error={!!errors?.size}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            disabled={loadingCategory}
                                            fullWidth 
                                            label='Category'
                                            select
                                            name='item_category_id'
                                            value={category}
                                            onChange={handleCategory}
                                            required
                                            helperText={!!errors?.item_category_id && errors?.item_category_id[0]}
                                            error={!!errors?.item_category_id}
                                        >
                                            {renderInputParentCategory()}
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            disabled={category === ''}
                                            fullWidth 
                                            label='Sub Category'
                                            select
                                            name='sub_item_category_id'
                                            defaultValue={staging?.sub_item_category?.id || ''}
                                            required
                                            helperText={!!errors?.sub_item_category_id && errors?.sub_item_category_id[0]}
                                            error={!!errors?.sub_item_category_id}
                                        >
                                            {renderInputChildCategory()}
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Unit'
                                            select
                                            name='unit_id'
                                            defaultValue={staging?.unit?.id || ''}
                                            required
                                            helperText={!!errors?.unit_id && errors?.unit_id[0]}
                                            error={!!errors?.unit_id}
                                            disabled={loadingUnit}
                                        >
                                            {renderUnitMenuItem()} 
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Tax'
                                            select
                                            name='tax'
                                            defaultValue={staging?.tax}
                                            required
                                            helperText={!!errors?.tax && errors?.tax[0]}
                                            error={!!errors?.tax}
                                        >
                                            <MenuItem value='yes'>Yes</MenuItem>
                                            <MenuItem value='no'>No</MenuItem>
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth 
                                            label='Description'
                                            name='description'
                                            defaultValue={staging?.description}
                                            required
                                            multiline
                                            rows={2}
                                            helperText={!!errors?.description && errors?.description[0]}
                                            error={!!errors?.description}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack direction='row' spacing={2}>
                                            <LoadingButton loading={loadingSave} fullWidth variant='contained' type='submit'>
                                                Submit
                                            </LoadingButton>
                                            <Button variant='outlined' onClick={handleReset} fullWidth>Reset</Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
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
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;