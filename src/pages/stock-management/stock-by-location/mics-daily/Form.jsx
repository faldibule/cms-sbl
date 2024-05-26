import CustomAutocomplete from '@components/CustomAutocomplete'
import CustomLinkBreadcrumsComponent from '@components/CustomLinkBreadcrumsComponent'
import Iconify from '@components/Iconify'
import ImportModal from '@components/ImportModal'
import Loading from '@components/Loading'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import TableInputRow from '@components/mics-daily/TableInputRow'
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct'
import useSaveMICSDaily from '@hooks/mics-daily/useSaveMICSDaily'
import { LoadingButton } from '@mui/lab'
import { Box, Breadcrumbs, Button, Card, Grid, Stack, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

    const { mutate: save, isLoading: loadingSave, error } = useSaveMICSDaily({
        onSuccess: () => {
            navigate(`/stock-management/stock-by-location/${location_id}/mics-daily`)
        }
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('location_id', location_id)
        item.forEach((v, i) => {
            const date = v?.date
            const quantity = v?.quantity || 0
            const item_product_id = v?.item_product?.id || v?.id
            const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price)
            formData.append(`item_product[${i}][date]`, date)
            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][quantity]`, quantity)
        })
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
                            <CustomLinkBreadcrumsComponent title='MICS Daily' to={`/stock-management/stock-by-location/${location_id}/mics-daily`} />
                            <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">
                                {props.title === 'add' ? 'Form Input MICS Daily' : 'Form Edit MICS Daily' }
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Grid container spacing={2} justifyContent='center'>
                    <Grid item xs={12} md={10}>
                        {!isApproved ? 
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Typography fontSize='1.3rem' textAlign='center' fontWeight='bold'>Form Input MOR</Typography>
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
                            </Card>
                        :
                            null
                        }
                    </Grid>
                    <Grid item xs={12} md={10}>
                        {item.length > 0 ? 
                            <Card sx={{ p: 2 }}>
                                {isApproved ?
                                    <Typography my={1} fontSize='1.3rem' textAlign='center' fontWeight='bold'>Detail Item </Typography>
                                : null
                                }
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
                                                <TableCellHeaderColor>Date</TableCellHeaderColor>
                                                <TableCellHeaderColor>Item Name</TableCellHeaderColor>
                                                <TableCellHeaderColor>Item Brand</TableCellHeaderColor>
                                                <TableCellHeaderColor>Description</TableCellHeaderColor>
                                                <TableCellHeaderColor>Quantity</TableCellHeaderColor>
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
                            </Card>
                        : 
                        null
                        }
                    </Grid>
                </Grid>
            </Box>
            <ImportModal 
                handleClose={handleModalImport}
                open={modalImport}
                title='MICS Daily'
                url={'read-excel/product-price'}
                onSuccessImport={onSuccessImport}
            />
        </Stack>
    )
}

export default Form