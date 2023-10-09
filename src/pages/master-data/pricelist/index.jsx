import { useState, useCallback } from 'react';
import { Button, Card, CardContent, Checkbox, Container, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import CustomSearchComponent from '@components/CustomSearchComponent';
import { LoadingButton } from '@mui/lab';
import { IntegerFormat, NumberFormat } from '@utils/Format';
import useFetchPricelist from '@hooks/pricelist/useFetchPricelist';
import useDeletePricelist from '@hooks/pricelist/useDeletePricelist';
import useSavePricelist from '@hooks/pricelist/useSavePricelist';
import Loading from '@components/Loading';
import DeleteDialog from '@components/DeleteDialog';
import useFetchLocation from '@hooks/location/useFetchLocation';
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct';
import useFetchSupplier from '@hooks/supplier/useFetchSupplier';
import CustomActionTableComponent from '@components/CustomActionTableComponent';

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: ''
    })

    const { data: rows, refetch, isFetchedAfterMount, isLoading: loadingRows } = useFetchPricelist(params)
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({ paginate: 0 })
    const { data: dataItemProduct, isLoading: loadingItemProduct } = useFetchItemProduct({ paginate: 0 })
    const { data: dataSupplier, isLoading: loadingSupplier } = useFetchSupplier({ paginate: 0 })

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

    const [supplier, setSupplier] = useState({
        supplier: '',
        supplier_name: '',
        supplier_category: ''
    })
    const [price, setPrice] = useState('')
    const handlePrice = (v) => setPrice(NumberFormat(v, 'Rp'))
    const handleSupplier = (supplier_id) => {
        const supplierById = dataSupplier.data.find(v => v.id === supplier_id)
        setSupplier({
            supplier: supplier_id, 
            supplier_name: supplierById?.name,
            supplier_category: supplierById?.category,
        })
    }
    
    const [loading, setLoading] = useState(false)
    const [staging, setStaging] = useState({})
    const handleReset = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging({})
            setLoading(false)
            setSupplier({ supplier: '', supplier_name: '', supplier_category: '' })
            setPrice('')
        }, 0);
    }
    const handleEdit = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging(data)
            setLoading(false)
            handlePrice(data.price)
            handleSupplier(data.supplier.id)
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

    const { mutate: deleteDepartment, isLoading: loadingDelete } = useDeletePricelist({
        onSuccess: () => {
            handleReset()
            refetch()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteDepartment(staging?.id)
    }

    const { mutate: save, isLoading: loadingSave, error } = useSavePricelist({
        onSuccess: () => {
            handleReset()
            refetch()
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('price', IntegerFormat(price))
        save({ formData, id: staging?.id })
    }

    if(isFetchedAfterMount && params.page !== 1 && rows !== undefined && rows?.data.length === 0){
        setParams({ ...params, page: rows.meta.last_page })
    }

    const renderData = useCallback(() => {
        if(rows === undefined || loadingItemProduct || loadingLocation || loadingSupplier) {
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
                    {value.location.location}
                </TableCell>
                <TableCell>
                    {value.supplier.name}
                </TableCell>
                <TableCell>
                    {value.item_product.code} - {value.item_product.name}
                </TableCell>
                <TableCell>
                    {NumberFormat(value.price, 'Rp')}
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
    }, [rows, loadingItemProduct, loadingSupplier, loadingLocation])

    const renderLocationMenuItem = useCallback(() => {
        if(loadingLocation) return null
        if(dataLocation.data.length === 0 ){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return dataLocation.data.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.location}</MenuItem>
            )
        })

    }, [dataLocation])

    const renderSupplierMenuItem = useCallback(() => {
        if(loadingSupplier) return null
        if(dataSupplier.data.length === 0 ){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return dataSupplier.data.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
            )
        })

    }, [dataSupplier])

    const renderItemProductMenuItem = useCallback(() => {
        if(loadingItemProduct) return null
        if(dataItemProduct.data.length === 0 ){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return dataItemProduct.data.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
            )
        })

    }, [dataItemProduct])

    return (
        <Page title='Pricelist'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Pricelist
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                    <Grid item xs={12} md={12}>
                                        <CustomSearchComponent />
                                    </Grid>
                                </Grid>
                                <TableContainer>
                                    <Table size='small' aria-label="simple table" sx={{ overflowX: 'auto', minWidth: 800 }}>
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                }}
                                            >
                                                <TableCell>No.</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Supplier Name</TableCell>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Harga</TableCell>
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
                                {!!staging.id ? 'Form Edit Pricelist' : 'Form Add Pricelist'}
                            </Typography>
                            {!loading ? 
                                <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            disabled={loadingLocation}
                                            fullWidth 
                                            label='Site Location'
                                            name='location_id'
                                            defaultValue={staging?.location?.id || ''}
                                            required
                                            helperText={!!errors?.location_id && errors?.location_id[0]}
                                            error={!!errors?.location_id}
                                            select
                                        >
                                            {renderLocationMenuItem()}
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            disabled={loadingSupplier}
                                            fullWidth 
                                            label='Supplier'
                                            name='supplier_id'
                                            value={supplier.supplier}
                                            onChange={(e) => handleSupplier(e.target.value)}
                                            required
                                            helperText={!!errors?.supplier_id && errors?.supplier_id[0]}
                                            error={!!errors?.supplier_id}
                                            select
                                        >
                                            {renderSupplierMenuItem()}
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Company Name'
                                            value={supplier.supplier_name}
                                            disabled
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Category Supplier'
                                            value={supplier.supplier_category}
                                            disabled
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            disabled={loadingItemProduct}
                                            fullWidth 
                                            label='Item Product'
                                            name='item_product_id'
                                            defaultValue={staging?.item_product?.id || ''}
                                            required
                                            helperText={!!errors?.item_product_id && errors?.item_product_id[0]}
                                            error={!!errors?.item_product_id}
                                            select
                                        >
                                            {renderItemProductMenuItem()}
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth 
                                            label='Harga'
                                            name='price'
                                            value={price}
                                            onChange={(e) => handlePrice(e.target.value)}
                                            required
                                            helperText={!!errors?.price && errors?.price[0]}
                                            error={!!errors?.price}
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