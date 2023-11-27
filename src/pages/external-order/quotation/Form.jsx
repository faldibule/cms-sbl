import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate } from 'react-router-dom'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import TableInputRow from '@components/quotation/TableInputRow'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import useFetchCustomer from '@hooks/customer/useFetchCustomer'
import useFetchUser from '@hooks/user-list/useFetchUser'
import Loading from '@components/Loading'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSaveQuotation from '@hooks/quotation/useSaveQuotation'
import ImportModal from '@components/ImportModal'
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct'
import { PRCustomer, dummy_item_product } from '@utils/Dummy'

const Form = (props) => {
    const { data } = props
    const isApproved = useMemo(() => {
        if(!!!data) return false
        return data.status === 'finish'
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState(dummy_item_product)

    // Handle PR Customer
    const [prCustomerState, setPRCustomerState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedPRCustomer = (value) => setPRCustomerState({...prCustomerState, selected: value})
    const handleInputPRCustomer = (value) => setPRCustomerState({...prCustomerState, input: value})
    // const { data: dataPRCustomerList, isLoading: loadingPRCustomerList } = useFetchPurchaseRequest({ paginate: 0 })
    // const { data: dataPRCustomerById, isLoading: loadingPRCustomerById } = useFetchPurchaseRequestById(prCustomer.selected?.id, { enabled: !!prCustomer.selected?.id })

    // useEffect(() => {
    //     let mounted = true
    //     if(!!!prCustomerState.selected?.id) return
    //     if(!!!dataPRById) return
    //     if(!mounted) return 

    //     if(props.title === 'edit' && prCustomerState.selected?.id === data.purchase_request?.id){
    //         setItem([...data.item_product])
    //         return
    //     }

    //     setItem([...dataPRById.item_product])

    //     return () => mounted = false

    // }, [prCustomerState.selected, dataPRById])

    // Handle Customer
    const [customerState, setCustomerState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedCustomer = (value) => setCustomerState({ ...customerState, selected: value })
    const handleInputCustomer = (value) => setCustomerState({ ...customerState, input: value })
    const { data: dataCustomer, isLoading: loadingCustomer } = useFetchCustomer({ paginate: 0 })

    // Handle User
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

    // Handle Item Product
    const [itemState, setItemState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedItem = (value) => setItem([...item, value])
    const handleInputItem = (value) => setItemState({ ...itemState, input: value })
    const { data: dataItemProduct, isLoading: loadingItemProduct } = useFetchItemProduct({ paginate: 0 })

    // Handle Markup
    const [markup, setMarkup] = useState(undefined)
    const handleMarkup = (value) => setMarkup(value)

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

    const { mutate: save, isLoading: loadingSave, error } = useSaveQuotation({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('customer_id', customerState.selected?.id)
        formData.append('prepared_by', userState.prepared_by.selected?.id)
        formData.append('checked_by', userState.checked_by.selected?.id)
        formData.append('approved1_by', userState.approved1_by.selected?.id)
        formData.append('approved2_by', userState.approved2_by.selected?.id)
        item.forEach((v, i) => {
            const name =  v?.name || v?.item_product?.name
            const size = v?.size || v?.item_product?.size
            const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price)
            const unit = v.item_product?.unit?.param || v?.unit?.param 
            const item_product_id = v?.item_product?.id || v?.id

            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][item_name]`, name)
            formData.append(`item_product[${i}][weight]`, size)
            formData.append(`item_product[${i}][unit]`, unit)
            formData.append(`item_product[${i}][quantity]`, v.quantity)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][vat]`, !!v.vat ? v.vat : 11)
            formData.append(`item_product[${i}][tnt]`, !!v.tnt ? v.tnt : '')
            formData.append(`item_product[${i}][remark]`, !!v.remark ? v.remark : '')
        })
        // save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                // handleInputCustomer(`${data?.customer.code} - ${data?.customer.name}`)
                // handleSelectedCustomer(data?.customer)
                // setUserState({
                //     ...userState,
                //     prepared_by: {
                //         input: data?.prepared_by?.name,
                //         selected: data?.prepared_by,
                //     },
                //     checked_by: {
                //         input: data?.checked_by?.name,
                //         selected: data?.checked_by,
                //     },
                //     approved1_by: {
                //         input: data?.approved1_by?.name,
                //         selected: data?.approved1_by,
                //     },
                //     approved2_by: {
                //         input: data?.approved2_by?.name,
                //         selected: data?.approved2_by,
                //     }
                // })
                // setItem([...data?.item_product])
            }
        }

        return () => mounted = false

    }, [props?.id])

    if(loadingCustomer || loadingUser || loadingItemProduct){
        return <Loading />
    }
    console.log(customerState)

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input Quotation' : 'Form Edit Quotation' }
                    </Typography>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                options={PRCustomer}
                                getOptionLabel={(option) => `${option.pr_customer_number}`}
                                label='PR Customer Number'
                                inputValue={prCustomerState.input}
                                setInputValue={handleInputPRCustomer}
                                selectedValue={prCustomerState.selected}
                                setSelectedValue={handleSelectedPRCustomer}
                                errors={errors?.prCustomer}
                            /> 
                        </Grid>
                        {!!prCustomerState.selected?.id ?
                        <>
                            <Grid item xs={12} md={6}>
                                <CustomAutocomplete 
                                    disabled={isApproved}
                                    getOptionLabel={(opt) => `${opt.code} - ${opt.name}`}
                                    options={dataCustomer?.data || []}
                                    label='Customer'
                                    inputValue={customerState.input}
                                    setInputValue={handleInputCustomer}
                                    selectedValue={customerState.selected}
                                    setSelectedValue={handleSelectedCustomer}
                                    errors={errors?.customer_id}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    // disabled
                                    label='Attention'
                                    // value={customerState.selected?.contact_person || ''}
                                    helperText={!!errors?.attention && errors?.attention[0]}
                                    error={!!errors?.attention}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth 
                                    // disabled
                                    label='Address'
                                    // value={customerState.selected?.address || ''}
                                    helperText={!!errors?.address && errors?.address[0]}
                                    error={!!errors?.address}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled
                                    fullWidth
                                    type='date'
                                    label="Request Date"
                                    name='request_date'
                                    defaultValue={'2023-11-11'}
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
                                    disabled
                                    fullWidth
                                    type='date'
                                    label="Delivery Date"
                                    name='delivery_date'
                                    defaultValue={'2023-11-11'}
                                    helperText={!!errors?.delivery_date && errors?.delivery_date[0]}
                                    error={!!errors?.delivery_date}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    disabled={isApproved}
                                    label='Vessel'
                                    name='vessel'
                                    defaultValue={data?.vessel}
                                    required
                                    helperText={!!errors?.vessel && errors?.vessel[0]}
                                    error={!!errors?.vessel}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    disabled={isApproved}
                                    label='Shipping Address'
                                    name='shipping_address'
                                    defaultValue={data?.shipping_address}
                                    required
                                    helperText={!!errors?.shipping_address && errors?.shipping_address[0]}
                                    error={!!errors?.shipping_address}
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
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth 
                                    disabled={isApproved}
                                    label='Term & Condition'
                                    multiline
                                    rows={3}
                                    name='term_condition'
                                    defaultValue={data?.term_condition}
                                    required
                                    helperText={!!errors?.term_condition && errors?.term_condition[0]}
                                    error={!!errors?.term_condition}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    label='Markup Value'
                                    type='number'
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    onChange={(e) => handleMarkup(e.target.value)}
                                    value={markup}
                                    required
                                    name='markup'
                                    helperText={!!errors?.markup && errors?.markup[0]}
                                    error={!!errors?.markup}
                                />
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
                                                    <TableCellHeaderColor>No.</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Item Name</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Size</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Unit</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Quantity</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Unit Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Markup Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>VAT</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Total Tax</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Total Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Grand Total</TableCellHeaderColor>
                                                    <TableCellHeaderColor>T/NT</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Remarks</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Action</TableCellHeaderColor>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {item.map((v, i) => <TableInputRow markup={markup} isApproved={isApproved} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} errors={errors} /> )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                : 
                                null
                                }
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <CustomGrandTotalComponent markup={markup} item={item} />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Stack direction='row' spacing={2}>
                                    <Button onClick={() => navigate('/external-order/quotation')} variant='contained'>
                                        Submit
                                    </Button>
                                    {/* {isApproved ?
                                    <Button onClick={() => navigate('/quotation')} variant='contained' startIcon={<Iconify icon='pajamas:go-back'  />}>
                                        Back
                                    </Button>
                                    :
                                    <LoadingButton loading={loadingSave} variant='contained' type='submit'>
                                        Submit
                                    </LoadingButton>
                                    } */}
                                    {props.title == 'edit' ? ''
                                        // <LoadingButton startIcon={<Iconify icon='material-symbols:print' />} variant='contained' type='button' sx={{ ml: 'auto' }}>
                                        //     Print
                                        // </LoadingButton>
                                    : null
                                    }
                                </Stack>
                            </Grid>
                        </>
                        : null
                        }
                    </Grid>
                </Card>
            </Box>
            <ImportModal 
                handleClose={handleModalImport}
                open={modalImport}
                title='Product Quotation'
                url={'read-excel/product-price'}
                onSuccessImport={onSuccessImport}
            />
        </Stack>
    )
}

export default Form