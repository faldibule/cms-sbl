import CustomAutocomplete from '@components/CustomAutocomplete'
import CustomLinkBreadcrumsComponent from '@components/CustomLinkBreadcrumsComponent'
import Iconify from '@components/Iconify'
import ImportModal from '@components/ImportModal'
import Loading from '@components/Loading'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import TableInputRow from '@components/mor-month/TableInputRow'
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct'
import useSaveMORMonth from '@hooks/mor-month/useSaveMORMonth'
import { LoadingButton } from '@mui/lab'
import { Box, Breadcrumbs, Button, Card, Grid, MenuItem, Stack, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const dataMonth = [
    { month: 'Januari', value: 1 },
    { month: 'Februari', value: 2 },
    { month: 'Maret', value: 3 },
    { month: 'April', value: 4 },
    { month: 'Mei', value: 5 },
    { month: 'Juni', value: 6 },
    { month: 'Juli', value: 7 },
    { month: 'Agustus', value: 8 },
    { month: 'September', value: 9 },
    { month: 'Oktober', value: 10 },
    { month: 'November', value: 11 },
    { month: 'Desember', value: 12 },
];

const getYearList = () => {
    const currentYear = new Date().getFullYear();
    const yearsBefore = [currentYear - 3, currentYear - 2, currentYear - 1];
    const yearList = [...yearsBefore, currentYear];

    return yearList;
};

const Form = (props) => {
    const { data } = props
    const isApproved = useMemo(() => {
        return props.title === 'edit'
    }, [props])

    const { location_id } = useParams()
    const navigate = useNavigate()
    const [item, setItem] = useState([])

    const [itemState, setItemState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedItem = (value) => setItem([...item, value])
    const handleInputItem = (value) => setItemState({ ...itemState, input: value })
    const { data: dataItemProduct, isLoading: loadingItemProduct } = useFetchItemProduct({ paginate: 0, location_id })

    // Handle Import
    const [modalImport, setModalImport] = useState(false)
    const handleModalImport = () => setModalImport(!modalImport)
    const onSuccessImport = (data) => {
        setItem(data.data)
    }

    const deleteItemTable = (e, index) => {
        setItem([...item.filter((v, i) => i !== index)])
    }

    const onChangeByIndex = (index, object) => {
        const temp = item.map((v, i) => {
            if(i === index){
                return {
                    ...v,
                    ...object
                }
            }
            return v
        })
        setItem([...temp])
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveMORMonth({
        onSuccess: () => {
            navigate(`/stock-management/stock-by-location/${location_id}/mor-month`)
        }
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('location_id', location_id)
        item.forEach((v, i) => {
            const last_stock = v?.last_stock || 0
            const actual_stock = v?.actual_stock || 0
            const item_product_id = v?.item_product?.id || v?.id
            const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price)

            formData.append(`product[${i}][item_product_id]`, item_product_id)
            formData.append(`product[${i}][price]`, price)
            formData.append(`product[${i}][last_stock]`, last_stock)
            formData.append(`product[${i}][actual_stock]`, actual_stock)
        })
        const temp = Object.fromEntries(formData)
        save({ formData })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                setItem([...data.data])
            }
        }

        return () => mounted = false

    }, [props?.id])

    if(loadingItemProduct){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                        <Typography variant='h5'>                       
                            {props.title === 'add' ? 'Form Input MOR' : 'Form Edit MOR' }
                        </Typography>
                        <Breadcrumbs sx={{ fontSize: '0.8rem', height: 30 }}>
                            <CustomLinkBreadcrumsComponent title='Stock Management' to="/stock-management" />
                            <CustomLinkBreadcrumsComponent title='MOR Monthly' to={`/stock-management/stock-by-location/${location_id}/mor-month`} />
                            <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">
                                {props.title === 'add' ? 'Form Input MOR Monthly' : 'Form Edit MOR Monthly' }
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Grid container spacing={2} justifyContent='center'>
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 2, mt: 3 }}>
                            <Typography py={2} fontSize='1.3rem' fontWeight='bold'>Form Input MOR</Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth 
                                        label='Month'
                                        name='month'
                                        defaultValue={data?.month || ''}
                                        required
                                        helperText={!!errors?.month && errors?.month[0]}
                                        error={!!errors?.month || !!errors?.meal_sheet_daily_data}
                                        select
                                    >
                                        {dataMonth.map((v, i) => {
                                            return (
                                                <MenuItem key={v.value} value={v.value}>{v.month}</MenuItem>
                                            )
                                        })}
                                    </TextField> 
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth 
                                        label='Year'
                                        name='year'
                                        defaultValue={data?.year || ''}
                                        required
                                        helperText={!!errors?.year && errors?.year[0]}
                                        error={!!errors?.year || !!errors?.meal_sheet_daily_data}
                                        select
                                    >
                                        {getYearList().map((v, i) => {
                                            return (
                                                <MenuItem key={v} value={v}>{v}</MenuItem>
                                            )
                                        })}
                                    </TextField> 
                                    {!!errors?.meal_sheet_daily_data ?
                                        <Typography mb={1} fontSize='0.8rem' color='error' variant='body2'>{errors.meal_sheet_daily_data[0]}</Typography>
                                    : null
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack mt={2} width='100%' direction='row' spacing={1} justifyContent='space-between'>
                                        <CustomAutocomplete 
                                            disabled={isApproved}
                                            getOptionLabel={(opt) => `${opt.code} - ${opt.name}`}
                                            options={dataItemProduct.data}
                                            label='Item'
                                            inputValue={itemState.input}
                                            setInputValue={handleInputItem}
                                            selectedValue={null}
                                            setSelectedValue={handleSelectedItem}
                                            isAutoCompleteItem={true}
                                            size='small'
                                        />
                                        <Button disabled={isApproved} onClick={handleModalImport} variant='contained' startIcon={<Iconify icon='material-symbols:upload-rounded' />}>
                                            Import
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    {item.length > 0 ? 
                                        <Box sx={{ mt: 2 }}>
                                            <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                                <Table stickyHeader aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow
                                                            sx={{
                                                                "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                                "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                                bgcolor: '#d6e9ff'
                                                            }}
                                                        >
                                                            <TableCellHeaderColor>No.</TableCellHeaderColor>
                                                            <TableCellHeaderColor>Item Name</TableCellHeaderColor>
                                                            <TableCellHeaderColor>Item Brand</TableCellHeaderColor>
                                                            <TableCellHeaderColor>Description</TableCellHeaderColor>
                                                            <TableCellHeaderColor>Last Stock</TableCellHeaderColor>
                                                            <TableCellHeaderColor>Actual Stock</TableCellHeaderColor>
                                                            <TableCellHeaderColor>Unit Price</TableCellHeaderColor>
                                                            <TableCellHeaderColor>Action</TableCellHeaderColor>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {item.map((v, i) => <TableInputRow isApproved={isApproved} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} errors={errors} /> )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Stack direction='row' spacing={2} mt={2}>
                                                <LoadingButton disabled={isApproved} loading={loadingSave} variant='contained' type='submit'>
                                                    Submit
                                                </LoadingButton>
                                                {props.title == 'edit' ? ''
                                                    // <LoadingButton startIcon={<Iconify icon='material-symbols:print' />} variant='contained' type='button' sx={{ ml: 'auto' }}>
                                                    //     Print
                                                    // </LoadingButton>
                                                : null
                                                }
                                            </Stack>
                                        </Box>
                                    : 
                                    null
                                    }
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <ImportModal 
                handleClose={handleModalImport}
                open={modalImport}
                title='MOR'
                url={'read-excel/product-price'}
                onSuccessImport={onSuccessImport}
            />
        </Stack>
    )
}

export default Form