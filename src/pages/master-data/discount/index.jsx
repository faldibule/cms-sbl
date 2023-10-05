import { useCallback, useState } from 'react'
import { Button, Card, CardContent, Checkbox, Container, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import CustomSearchComponent from '@components/CustomSearchComponent';
import { LoadingButton } from '@mui/lab';
import useFetchDiscount from '@hooks/discount/useFetchDiscount';
import useDeleteDiscount from '@hooks/discount/useDeleteDiscount';
import Loading from '@components/Loading';
import DeleteDialog from '@components/DeleteDialog';
import useSaveDiscount from '@hooks/discount/useSaveDiscount';
import CustomActionTableComponent from '@components/CustomActionTableComponent';

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchDiscount(params)
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

    const { mutate: deleteDiscount, isLoading: loadingDelete } = useDeleteDiscount({
        onSuccess: () => {
            handleReset()
            refetch()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteDiscount(staging?.id)
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveDiscount({
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
                    {value.discount}%
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

    return (
        <Page title='Discount'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Discount
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
                                                <TableCell>Discount</TableCell>
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
                                {!!staging.id ? 'Form Edit Discount' : 'Form Add Discount'}
                            </Typography>
                            {!loading ?
                                <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth 
                                            label='Discount'
                                            name='discount'
                                            defaultValue={staging?.discount}
                                            required
                                            helperText={!!errors?.discount && errors?.discount[0]}
                                            error={!!errors?.discount}
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