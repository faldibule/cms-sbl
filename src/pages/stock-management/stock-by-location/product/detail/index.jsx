import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Container, Grid, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import Loading from '@components/Loading';
import useFetchStockDetailProduct from '@hooks/stock-by-location/useFetchStockDetailProduct';
import useFetchHistoryStock from '@hooks/stock-detail-product/useFetchHistoryStock';
import useSaveHistoryStock from '@hooks/stock-detail-product/useSaveHistoryStock';
import { LoadingButton } from '@mui/lab';

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
        if(!!!data?.product_stock?.id){
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
                        {value.description}
                    </TableCell>
                </TableRow>
            )
        })
    }, [dataHistory, data])

    if(loadingDetailProduct){
        return <Loading />
    }

    return (
        <Page title='Stock Detail Product'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>Stock Detail Product</Typography>
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