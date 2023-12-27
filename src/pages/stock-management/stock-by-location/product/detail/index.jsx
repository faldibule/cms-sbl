import CustomLinkBreadcrumsComponent from '@components/CustomLinkBreadcrumsComponent';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useFetchLocationById from '@hooks/location/useFetchLocationById';
import useFetchStockDetailProduct from '@hooks/stock-by-location/useFetchStockDetailProduct';
import useFetchHistoryStock from '@hooks/stock-detail-product/useFetchHistoryStock';
import useSaveHistoryStock from '@hooks/stock-detail-product/useSaveHistoryStock';
import { LoadingButton } from '@mui/lab';
import { Box, Breadcrumbs, Card, CardContent, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CustomGridLabel = ({ label, value }) => {
    return (
        <Grid container maxWidth={410} spacing={1}>
            <Grid item xs={5}>
                <Typography>{label}</Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography>:</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography fontWeight='bold'>{value}</Typography>
            </Grid>
        </Grid>
    )
}

const index = () => {
    const navigate = useNavigate()
    const { location_id, item_product_id } = useParams()
    const [params, setParams] = useState({
        location_id,
        item_product_id
    })
    const { data, isLoading: loadingDetailProduct, refetch: refetchDetailProduct } = useFetchStockDetailProduct(params)

    const id_product = data?.product_stock?.id
    
    const { data: dataLocationById, isLoading: loadingDataLocationById } = useFetchLocationById(location_id)

    const [paramsHistory, setParamsHistory] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
        id: data?.product_stock?.id
    })
    const { data: dataHistory, isLoading: loadingHistoryProduct, refetch: refetchHistory } = useFetchHistoryStock({ ...paramsHistory, id: id_product }, { enabled: !!data?.product_stock?.id })

    const handleChangePage = (event, newPage) => {
        setParamsHistory((prev) => {
            return {
                ...prev,
                page: newPage + 1,
            };
        });
    };
    const handleChangeRowsPerPage = (event) => {
        setParamsHistory((prev) => {
            return {
                ...prev,
                page: 1,
                limit: +event.target.value,
            };
        });
    };

    const [reset, setReset] = useState(false)
    const handleReset = () => {
        setReset(true)
        setTimeout(() => {
            setReset(false)
        }, 500);
        
    }

    const refreshData = () => {
        refetchDetailProduct()
        refetchHistory()
        handleReset()
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveHistoryStock({
        onSuccess: () => {
            refreshData()
        }
    })

    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('item_product_id', item_product_id)
        formData.append('location_id', location_id)
        save({ formData })
    }
    
    const renderData = useCallback(() => {
        const rows = dataHistory
        if(!data?.product_stock?.id){
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
                        {paramsHistory.search !==
                            "" && (
                            <div
                                style={{
                                    display:
                                        "inline-block",
                                }}
                            >
                                &nbsp;for "<b>{paramsHistory.search}</b>"
                            </div>
                        )}
                        .
                    </TableCell>
                </TableRow>
            )
        }

        if(rows === undefined || !dataLocationById) {
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
                        {paramsHistory.search !==
                            "" && (
                            <div
                                style={{
                                    display:
                                        "inline-block",
                                }}
                            >
                                &nbsp;for "<b>{paramsHistory.search}</b>"
                            </div>
                        )}
                        .
                    </TableCell>
                </TableRow>
            )
        }
        return rows.data.map((value, key) => {
            return (
                <TableRow key={key}>
                    <TableCell
                        component="th"
                        scope="row"
                        align="center"
                    >
                        {rows.meta.from+key}.
                    </TableCell>
                    <TableCell>
                        {value.quantity}
                    </TableCell>
                    <TableCell>
                        {value.from}
                    </TableCell>
                    {dataLocationById.main === 1 ? 
                        <TableCell>
                            {value?.to || '-'}
                        </TableCell>
                        : null
                    } 
                    <TableCell>
                        {value.purchase_order}
                    </TableCell>
                    <TableCell>
                        {moment(value.delivery_date).format('LL')}
                    </TableCell>
                    <TableCell>
                        {value.description}
                    </TableCell>
                </TableRow>
            )
        })
    }, [dataHistory, data, dataLocationById])

    
    if(!loadingDetailProduct && !data) {
        return 'Data Tidak Ditemukan !'
    }
   
    if(loadingDetailProduct || loadingDataLocationById){
        return <Loading />
    }
    
    return (
        <Page title='Stock Detail Product'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Stack spacing={1} mb={3}>
                                <Typography variant='h4'>Stock Detail Product</Typography>
                                <Breadcrumbs sx={{ fontSize: '0.8rem' }}>
                                    <CustomLinkBreadcrumsComponent title='Stock Management' to="/stock-management" />
                                    <CustomLinkBreadcrumsComponent title='Stock By Location' to={`/stock-management/stock-by-location/${location_id}/product`} />
                                    <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">Stock Detail</Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Grid container spacing={2}>

                            {/* Item Product Detail */}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                            <Grid item xs={12} md={12}>
                                                <Typography mb={2} fontWeight='bold'>Detail Product</Typography>
                                                <Grid container>
                                                    <Grid item xs={12} md={6}>
                                                        <CustomGridLabel 
                                                            label='Name'
                                                            value={data.product_stock.item_product.name}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <CustomGridLabel 
                                                            label='Code'
                                                            value={data.product_stock.item_product.code}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <CustomGridLabel 
                                                            label='Category Code'
                                                            value={data.product_stock.item_product.item_category.category_code}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <CustomGridLabel 
                                                            label='Category Name'
                                                            value={data.product_stock.item_product.item_category.category}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <CustomGridLabel 
                                                            label='Sub Category Code'
                                                            value={data.product_stock.item_product.sub_item_category.category_code}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <CustomGridLabel 
                                                            label='Sub Category Name'
                                                            value={data.product_stock.item_product.sub_item_category.category}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <CustomGridLabel 
                                                            label='Brand'
                                                            value={data.product_stock.item_product.brand}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <CustomGridLabel 
                                                            label='Latest Stock'
                                                            value={data.product_stock.stock}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            
                            {/* Form Stock */}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                            <Grid item xs={12} md={12}>
                                                <Typography mb={2} fontWeight='bold'>Form Stock</Typography>
                                                {!reset ?
                                                    <Stack component='form' onSubmit={onSubmit} spacing={2}>
                                                        <TextField 
                                                            fullWidth 
                                                            label='Quantity'
                                                            name='quantity'
                                                            type='number'
                                                            defaultValue=''
                                                            required
                                                            helperText={!!errors?.quantity && errors?.quantity[0]}
                                                            error={!!errors?.quantity}
                                                        />
                                                        <TextField 
                                                            fullWidth 
                                                            label='Description'
                                                            name='description'
                                                            multiline
                                                            rows={3}
                                                            defaultValue=''
                                                            required
                                                            helperText={!!errors?.description && errors?.description[0]}
                                                            error={!!errors?.description}
                                                        />
                                                        <LoadingButton loading={loadingSave} sx={{ width: { xs: '100%', md: '30%' }, alignSelf: 'end' }} variant='contained' type='submit'>
                                                            Submit
                                                        </LoadingButton>
                                                    </Stack>
                                                : 
                                                    <Box sx={{ width: '100%', minHeight: 250 }}>
                                                        <Loading />
                                                    </Box>
                                                }
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* History Stock Product */}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                            <Grid item xs={12} md={12}>
                                                <Typography mb={2} fontWeight='bold'>History Product</Typography>
                                                <TableContainer>
                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow
                                                                sx={{
                                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                                }}
                                                            >
                                                                <TableCell>No.</TableCell>
                                                                <TableCell>Quantity</TableCell>
                                                                <TableCell>From</TableCell>
                                                                {dataLocationById.main === 1 ? 
                                                                    <TableCell>To</TableCell>
                                                                    : null
                                                                }
                                                                <TableCell>PO Number</TableCell>
                                                                <TableCell>PO Date</TableCell>
                                                                <TableCell>Description</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {renderData()}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                {dataHistory !== undefined && dataHistory.data.length > 0 && (
                                                    <TablePagination
                                                        component="div"
                                                        count={dataHistory.meta.total}
                                                        page={paramsHistory.page - 1}
                                                        rowsPerPage={paramsHistory.limit}
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
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;