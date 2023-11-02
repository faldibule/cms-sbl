import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '@hooks/useCustomSnackbar'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import TableInputRow from '@components/po-quotation/TableInputRow'
import { read, utils } from 'xlsx'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import useFetchSupplier from '@hooks/supplier/useFetchSupplier'
import Loading from '@components/Loading'
import useFetchUser from '@hooks/user-list/useFetchUser'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useFetchDiscount from '@hooks/discount/useFetchDiscount'
import useFetchPricelist from '@hooks/pricelist/useFetchPricelist'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSavePOQuotation from '@hooks/po-quotation/useSavePOQuotation'
import ImportModal from '@components/ImportModal'

const Form = (props) => {
    const { data } = props

    const isApproved = useMemo(() => {
        if(!!!data) return false
        return data.status === 'finish'
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState([])
    const [form, setForm] = useState({
        item: '',
        document: {
            file: '',
            file_name: '',
            file_url: '',
        }
    })

    // Supplier Handle
    const [supplierState, setSupplierState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedSupplier = (value) => setSupplierState({...supplierState, selected: value})
    const handleInputSupplier = (value) => setSupplierState({...supplierState, input: value})
    const { data: dataSupplier, isLoading: loadingSupplier } = useFetchSupplier({ paginate: 0 })

    // User Handle
    const [userState, setUserState] = useState({
        prepared_by: {
            input: '',
            selected: null
        },
        checked_by: {
            input: '',
            selected: null
        },
        approved1_by: {
            input: '',
            selected: null
        },
        approved2_by: {
            input: '',
            selected: null
        },
    })
    const handleUser = (name, type) => {
        return (value) => {
            setUserState({
                ...userState,
                [name]: {
                    ...userState[name],
                    [type]: value
                }
            })
        }
    }
    const { data: dataUser, isLoading: loadingUser } = useFetchUser({ paginate: 0 })

    // Location Handle
    const [locationState, setLocationState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedLocation = (value) => setLocationState({...locationState, selected: value})
    const handleInputLocation = (value) => setLocationState({...locationState, input: value})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({ paginate: 0 })

    // Discount Handle
    const { data: dataDiscount, isLoading: loadingDiscount } = useFetchDiscount({ paginate: 0 })
    const [discount, setDiscount] = useState({
        id: '',
        value: 0
    })
    const handleDiscount = (id) => {
        const discountById = dataDiscount?.data?.find(v => v.id === id)
        setDiscount({
            id: discountById.id,
            value: discountById.discount
        })
    }

    // Item Handle
    const [itemState, setItemState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedItem = (value) => setItem([...item, value])
    const handleInputItem = (value) => setItemState({ ...itemState, input: value })
    const { data: dataPricelist, isLoading: loadingPricelist } = useFetchPricelist({ paginate: 0 })
    
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

    const { mutate: save, isLoading: loadingSave, error  } = useSavePOQuotation({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('supplier_id', supplierState.selected?.id)
        formData.append('location_id', locationState.selected?.id)
        formData.append('prepared_by', userState.prepared_by.selected?.id)
        formData.append('checked_by', userState.checked_by.selected?.id)
        formData.append('approved1_by', userState.approved1_by.selected?.id)
        formData.append('approved2_by', userState.approved2_by.selected?.id)
        item.forEach((v, i) => {
            const price = parseInt(v?.price) || parseInt(v?.item_price)
            const item_product_id = v.item_product?.id
            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][weight]`, v.weight)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][quantity]`, v.quantity)
            formData.append(`item_product[${i}][vat]`, !!v.vat ? v.vat : 11)
            formData.append(`item_product[${i}][tnt]`, !!v.tnt ? v.tnt : '')
        })
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                setSupplierState({
                    input: data.supplier.name,
                    selected: data.supplier
                })
                setLocationState({
                    input: `${data.location.location_code} - ${data.location.location}`,
                    selected: data.location
                })
                setDiscount({
                    id: data?.discount?.id,
                    value: data?.discount?.discount
                })
                setUserState({
                    ...userState,
                    prepared_by: {
                        input: data?.prepared_by?.name,
                        selected: data?.prepared_by,
                    },
                    checked_by: {
                        input: data?.checked_by?.name,
                        selected: data?.checked_by,
                    },
                    approved1_by: {
                        input: data?.approved1_by?.name,
                        selected: data?.approved1_by,
                    },
                    approved2_by: {
                        input: data?.approved2_by?.name,
                        selected: data?.approved2_by,
                    }
                })
                setItem([...data.item_product])
            }
        }

        return () => mounted = false

    }, [props])
    
    const renderDiscountMenuItem = useCallback(() => {
        if(loadingDiscount) return null
        if(dataDiscount.data.length === 0 ){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return dataDiscount.data.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.discount}%</MenuItem>
            )
        })

    }, [dataDiscount])

    if(loadingSupplier || loadingLocation || loadingDiscount || loadingUser || loadingPricelist){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input PO Quotation' : 'Form Edit PO Quotation' }
                    </Typography>
                    {!!data ? 
                        <Typography fontStyle='italic' variant='body2' fontWeight='bold'>
                            {data?.po_number}
                        </Typography>
                    : null}
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                options={dataSupplier.data}
                                getOptionLabel={(option) => `${option.name}`}
                                label='Supplier'
                                inputValue={supplierState.input}
                                setInputValue={handleInputSupplier}
                                selectedValue={supplierState.selected}
                                setSelectedValue={handleSelectedSupplier}
                                errors={errors?.supplier_id}
                                key='supplier'
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled={isApproved}       
                                fullWidth 
                                label='Attn Name'
                                name='attn_name'
                                required
                                defaultValue={data?.attn_name}
                                helperText={!!errors?.attn_name && errors?.attn_name[0]}
                                error={!!errors?.attn_name}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled={isApproved}
                                fullWidth
                                type='date'
                                label="Request Date"
                                name='request_date'
                                defaultValue={data?.request_date}
                                helperText={!!errors?.request_date && errors?.request_date[0]}
                                error={!!errors?.request_date}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled={isApproved}
                                fullWidth
                                type='date'
                                label="Delivery Date"
                                name='delivery_date'
                                defaultValue={data?.delivery_date}
                                helperText={!!errors?.delivery_date && errors?.delivery_date[0]}
                                error={!!errors?.delivery_date}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                options={dataLocation.data}
                                getOptionLabel={(option) => `${option.location_code} - ${option.location}`}
                                label='Location'
                                inputValue={locationState.input}
                                setInputValue={handleInputLocation}
                                selectedValue={locationState.selected}
                                setSelectedValue={handleSelectedLocation}
                                errors={errors?.location_id}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                disabled={isApproved}
                                fullWidth
                                label='Discount'
                                name='discount_id'
                                value={discount.id}
                                onChange={(e) => handleDiscount(e.target.value)}
                                required
                                helperText={!!errors?.discount_id && errors?.discount_id[0]}
                                error={!!errors?.discount_id}
                                select
                            >
                                {renderDiscountMenuItem()}
                            </TextField> 
                        </Grid>
                        {/* <Grid item xs={12} md={12}>
                            <TextField
                                label="Shipping Address"
                                fullWidth
                                multiline
                                rows={3}
                                name='shipping_address'
                                required
                                defaultValue={data?.shipping_address}
                                helperText={!!errors?.shipping_address && errors?.shipping_address[0]}
                                error={!!errors?.shipping_address}
                            />
                        </Grid> */}
                        <Grid item xs={12} md={12}>
                            <TextField
                                disabled={isApproved}       
                                fullWidth 
                                label='Terms & Condition'
                                multiline
                                rows={3}
                                name='term_condition'
                                required
                                defaultValue={data?.term_condition}
                                helperText={!!errors?.term_condition && errors?.term_condition[0]}
                                error={!!errors?.term_condition}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                getOptionLabel={(opt) => `${opt.name}`}
                                options={dataUser.data}
                                label='Prepared By'
                                inputValue={userState.prepared_by.input}
                                setInputValue={handleUser('prepared_by', 'input')}
                                selectedValue={userState.prepared_by.selected}
                                setSelectedValue={handleUser('prepared_by', 'selected')}
                                errors={errors?.prepared_by}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                getOptionLabel={(opt) => `${opt.name}`}
                                options={dataUser.data}
                                label='Checked By'
                                inputValue={userState.checked_by.input}
                                setInputValue={handleUser('checked_by', 'input')}
                                selectedValue={userState.checked_by.selected}
                                setSelectedValue={handleUser('checked_by', 'selected')}
                                errors={errors?.checked_by}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                getOptionLabel={(opt) => `${opt.name}`}
                                options={dataUser.data}
                                label='Approved By 1'
                                inputValue={userState.approved1_by.input}
                                setInputValue={handleUser('approved1_by', 'input')}
                                selectedValue={userState.approved1_by.selected}
                                setSelectedValue={handleUser('approved1_by', 'selected')}
                                errors={errors?.approved1_by}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                getOptionLabel={(opt) => `${opt.name}`}
                                options={dataUser.data}
                                label='Approved By 2'
                                inputValue={userState.approved2_by.input}
                                setInputValue={handleUser('approved2_by', 'input')}
                                selectedValue={userState.approved2_by.selected}
                                setSelectedValue={handleUser('approved2_by', 'selected')}
                                errors={errors?.approved2_by}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                                <CustomAutocomplete 
                                    disabled={isApproved}       
                                    getOptionLabel={(opt) => `${opt.item_product.code} - ${opt.item_product.name}`}
                                    options={dataPricelist.data}
                                    label='Item'
                                    inputValue={itemState.input}
                                    setInputValue={handleInputItem}
                                    selectedValue={null}
                                    setSelectedValue={handleSelectedItem}
                                    isAutoCompleteItem={true}
                                    size='small'
                                />
                                <Button onClick={handleModalImport} disabled={isApproved} fullWidth sx={{ width: 120 }} variant='contained' startIcon={<Iconify icon='material-symbols:upload-rounded' />}>
                                    Import
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {item.length > 0 ? 
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

                                                {props.type === 'approval' ? 
                                                <TableCell></TableCell>
                                                : null
                                                }
                                                <TableCellHeaderColor>No.</TableCellHeaderColor>
                                                <TableCellHeaderColor>Item Name</TableCellHeaderColor>
                                                <TableCellHeaderColor>Size</TableCellHeaderColor>
                                                <TableCellHeaderColor>Unit</TableCellHeaderColor>
                                                <TableCellHeaderColor>Quantity</TableCellHeaderColor>
                                                <TableCellHeaderColor>Unit Price</TableCellHeaderColor>
                                                <TableCellHeaderColor>Tax</TableCellHeaderColor>
                                                <TableCellHeaderColor>VAT</TableCellHeaderColor>
                                                <TableCellHeaderColor>Total Price</TableCellHeaderColor>
                                                <TableCellHeaderColor>Grand Total</TableCellHeaderColor>
                                                <TableCellHeaderColor>T/NT</TableCellHeaderColor>
                                                <TableCellHeaderColor>Action</TableCellHeaderColor>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => <TableInputRow isApproved={isApproved} errors={errors} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            : 
                            null
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <CustomGrandTotalComponent discount={discount.value} item={item} />
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                {isApproved ?
                                    <Button onClick={() => navigate(`/file/${data?.id}/outgoing_po`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
                                        Next
                                    </Button>
                                :
                                    <LoadingButton endIcon={<Iconify icon='carbon:next-filled' />} loading={loadingSave} variant='contained' type='submit'>
                                        Next
                                    </LoadingButton>
                                }
                                {props.title == 'edit' ? ''
                                    // <LoadingButton startIcon={<Iconify icon='material-symbols:print' />} variant='contained' type='button' sx={{ ml: 'auto' }}>
                                    //     Print
                                    // </LoadingButton>
                                : null
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
            <ImportModal 
                handleClose={handleModalImport}
                open={modalImport}
                title='Product PO Keluar Quotation'
                url={'read-excel/product-price'}
                onSuccessImport={onSuccessImport}
            />
        </Stack>
    )
}

export default Form