import ConfirmDialog from '@components/ConfirmDialog'
import CustomAutocomplete from '@components/CustomAutocomplete'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import Iconify from '@components/Iconify'
import Loading from '@components/Loading'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import DeletedTableRow from '@components/po-catering/DeletedTableRow'
import TableInputRow from '@components/quotation/TableInputRow'
import useFetchCustomer from '@hooks/customer/useFetchCustomer'
import useFetchPRCustomer from '@hooks/pr-customer/useFetchPRCustomer'
import useFetchPRCustomerById from '@hooks/pr-customer/useFetchPRCustomerById'
import useSaveQuotation from '@hooks/quotation/useSaveQuotation'
import useFetchUser from '@hooks/user-list/useFetchUser'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Checkbox, Grid, InputAdornment, MenuItem, Stack, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { IntegerFormat, NumberFormat } from '@utils/Format'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Form = (props) => {
    const { data } = props
    const approvalMemo = useMemo(() => {
        return {
            isChecked: !!data?.checked_date,
            checked_date: data?.checked_date,
        }
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState([])
    const [isEdit, setIsEdit] = useState(false)
 
    const isApproved = useMemo(() => {
        if(!data) return false
        if(!data.checked_date) return false

        return !isEdit
    }, [data, isEdit])

    const [modalConfirmEdit, setModalConfirmEdit] = useState(false)
    const handleEditButton = () => {
        if(!isEdit){
            setModalConfirmEdit(true)
            return
        }
        setIsEdit(false)
    }
    const handleClickModalEdit = () => {
        setModalConfirmEdit(false)
        setIsEdit(true)
    }

    // Handle PR Customer
    const [prCustomerState, setPRCustomerState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedPRCustomer = (value) => setPRCustomerState({...prCustomerState, selected: value})
    const handleInputPRCustomer = (value) => setPRCustomerState({...prCustomerState, input: value})
    const { data: dataPRCustomerList, isLoading: loadingPRCustomerList } = useFetchPRCustomer({ paginate: 0 })
    const { data: dataPRCustomerById, isLoading: loadingPRCustomerById } = useFetchPRCustomerById(prCustomerState.selected?.id, { enabled: !!prCustomerState.selected?.id })

    useEffect(() => {
        let mounted = true
        if(!!!prCustomerState.selected?.id) return
        if(!!!dataPRCustomerById) return
        if(!mounted) return 

        if(props.title === 'edit' && prCustomerState.selected?.id === data.pr_customer?.id){
            setItem([...data.item_product])
            return
        } 
        let temp = []
        for(let i = 0; i < 1; i++){
            temp = [...temp, ...dataPRCustomerById.item_product]
        }
        // setItem([...dataPRCustomerById.item_product])
        setItem([...temp])

        return () => mounted = false

    }, [prCustomerState.selected, dataPRCustomerById])

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

    // Get product that exist in PR but not exist in PO
    const differenceProductPRtoPO = useMemo(() => {
        if(!dataPRCustomerById) return []

        const tempIdProductPRCustomer = item.map(v => v.item_product.id)
        return dataPRCustomerById.item_product.filter(v => !tempIdProductPRCustomer.includes(v.item_product.id))
    }, [dataPRCustomerById, item])

    // Get product that exist in PO but not exist in PR (deleted)
    const differenceProductPOtoPR = useMemo(() => {
        if(!dataPRCustomerById) return []

        // get all product id from PR
        const tempIdProductPRCustomer = dataPRCustomerById.item_product.map(v => v.item_product.id)

        return item.filter(v => !tempIdProductPRCustomer.includes(v.item_product.id))
    }, [dataPRCustomerById, item])
    
    const [currentItem, setCurrentItem] = useState([])
    const itemFiltered = useMemo(() => {
        if(!data) return item
        if(!dataPRCustomerById) return []

        // get all product id from PR
        const tempIdProductPRCustomer = dataPRCustomerById.item_product.map(v => v.item_product.id)
    
        const temp = [...item.filter(v => tempIdProductPRCustomer.includes(v.item_product.id)), ...differenceProductPRtoPO]
        setCurrentItem(temp)
        return temp
    }, [dataPRCustomerById, item, differenceProductPRtoPO])

    const deleteItemTable = (e, index) => {
        setCurrentItem([...currentItem.filter((v, i) => i !== index)])
    }

    const onChangeByIndex = (index, object) => {
        const temp = currentItem.map((v, i) => {
            if(i === index){
                return {
                    ...v,
                    ...object
                }
            }
            return v
        })
        setCurrentItem([...temp])
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveQuotation({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('pr_customer_id', prCustomerState.selected?.id)
        formData.append('customer_id', customerState.selected?.id)
        formData.append('prepared_by', userState.prepared_by.selected?.id)
        formData.append('checked_by', userState.checked_by.selected?.id)
        formData.append('approved1_by', userState.approved1_by.selected?.id)
        formData.append('approved2_by', userState.approved2_by.selected?.id)
        formData.append('mark_up', 0)
        itemFiltered.forEach((v, i) => {
            const size = v?.size || v?.item_product?.size
            const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price)
            const unit = v.item_product?.unit?.param || v?.unit?.param 
            const item_product_id = v?.item_product?.id || v?.id
            const tnt = !!v.tnt ? v.tnt : 'T'
            const markupValue = !!v?.markupPrice ? IntegerFormat(v?.markupPrice) : v?.markup_value || v?.item_product?.sell_price - price

            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][weight]`, size)
            formData.append(`item_product[${i}][unit]`, unit)
            formData.append(`item_product[${i}][quantity]`, v.quantity)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][vat]`, !!v.vat ? v.vat : 11)
            formData.append(`item_product[${i}][tnt]`, tnt)
            formData.append(`item_product[${i}][remark]`, !!v.remark ? v.remark : '')

            // New Param
            formData.append(`item_product[${i}][markup_value]`, markupValue)
            formData.append(`item_product[${i}][markup_vat]`, tnt === 'T' ? 11 : 0)
        })
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                handleMarkup(data.mark_up)
                setPRCustomerState({
                    input: data.pr_customer.pr_code,
                    selected: data.pr_customer,
                })
                setCustomerState({
                    input:  `${data.customer.code} - ${data.customer.name}`,
                    selected: data.customer,
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
                    }
                })
                setItem([...data?.item_product])
            }
        }

        return () => mounted = false

    }, [props?.id])

    // handle checkbox table
    const [selected, setSelected] = useState([])
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected([...newSelected]);
    };
    const isSelected = (index) => selected.indexOf(index) !== -1;
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelected = item.map((n, i) => i);
          setSelected(newSelected);
          return;
        }
        setSelected([]);
    };

    // Handle Markup
    const [markup, setMarkup] = useState({
        type: '',
        price: 0,
        percentage: 0,
    })
    const handleMarkup = (e) => {
        if(e.target?.name === 'percentage' || e.target?.name === 'type'){
            setMarkup({
                ...markup,
                [e.target.name]: e.target?.value
            })
            return;
        }
        setMarkup({
            ...markup,
            price: NumberFormat(e.target?.value, 'Rp')
        })
    }
    const handleApplyMarkup = () => {
        const isTypePercentage = markup.type === 'markupPercentage'
        setItem((prev) => prev.map((value, index) => {
            const { tax } = value.item_product
            const isHasTax = tax === 'yes'
            let vat = isHasTax ? 11 : 0
            const price = parseInt(value.item_price)
            const newPrice = (price * vat / 100) + price
            
            let temp = {}
            if(isTypePercentage){
                temp = {
                    markupPercentage: markup.percentage,
                    markupPrice: NumberFormat(( markup.percentage * newPrice / 100), 'Rp')
                }
            }else{
                const tempMarkupPrice = IntegerFormat(markup.price === 0 ? 'Rp.0' : markup.price)
                temp = {
                    markupPrice: NumberFormat(markup.price, 'Rp'),
                    markupPercentage: (tempMarkupPrice / newPrice * 100),
                }
            }

            return selected.includes(index) ? {
                ...value,
                ...temp
            } : value
        }))
    }

    const renderItemDetails = useMemo(() => {
        if(currentItem.length === 0) return null
        return currentItem.map((v, i) => 
            <TableInputRow  
                isApproved={isApproved} 
                key={i} i={i} v={v} 
                deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} 
                errors={errors} 
                handleClick={handleClick}
                isItemSelected={isSelected(i)}
            /> 
        )
    }, [currentItem, isApproved, errors, selected])

    if(loadingCustomer || loadingUser){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Stack direction='row' justifyContent='space-between'>
                        <Stack>
                            <Typography variant='h5'>
                                {props.title === 'add' ? 'Form Input Quotation' : 'Form Edit Quotation' }
                            </Typography>
                            {!!data ? 
                                <Typography fontStyle='italic' variant='body2' fontWeight='bold'>
                                    {data?.quotation_number}
                                </Typography>
                            : null}
                        </Stack>
                        {!!data && !!data.checked_date ?
                            <Button onClick={() => handleEditButton()} variant='contained' color='primary' sx={{ height: '5dvh' }}>
                                {isEdit ? 'Cancel Edit' : 'Edit Data Quotation'}
                            </Button>
                        : null
                        }
                    </Stack>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                options={dataPRCustomerList?.data || []}
                                getOptionLabel={(option) => `${option.pr_number}`}
                                label='PR Customer Number'
                                inputValue={prCustomerState.input}
                                setInputValue={handleInputPRCustomer}
                                selectedValue={prCustomerState.selected}
                                setSelectedValue={handleSelectedPRCustomer}
                                errors={errors?.pr_customer_id}
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
                                    disabled
                                    label='Attention Name'
                                    value={customerState.selected?.contact_person || ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth 
                                    disabled
                                    multiline
                                    rows={3}
                                    label='Customer Address'
                                    value={customerState.selected?.address || ''}
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
                            <Grid item xs={12} md={approvalMemo.isChecked ? 3 : 6}>
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
                            {approvalMemo.isChecked ?
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        disabled
                                        fullWidth
                                        label="Checked On"
                                        value={moment(approvalMemo?.checked_date).format('LL') || ''}
                                    />
                                </Grid>
                            : null
                            }
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

                            {/* Deleted item */}
                            {(!!data && differenceProductPOtoPR.length > 0) ?
                            <Grid item xs={12} md={12}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', my: 2 }}>Deleted Item Product</Typography>
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
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>No.</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Item Name</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Item Brand</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Description</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Size</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Unit</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Price</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Quantity</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>VAT</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Total Tax</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Total Price</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Grand Total</TableCellHeaderColor>
                                                <TableCellHeaderColor bgcolor='#ffd3d3'>Remarks</TableCellHeaderColor>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {differenceProductPOtoPR.map((v, i) => <DeletedTableRow isApproved={true} errors={errors} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            : null
                            }
                            
                            {/* Markup */}
                            <Grid item xs={12} md={12}>
                                <Stack direction='row' alignItems='center' spacing={2} mt={2}>
                                    <TextField
                                        disabled={isApproved}
                                        fullWidth 
                                        label='Markup Price'
                                        name='type'
                                        value={markup.type}
                                        onChange={handleMarkup}
                                        select
                                    >
                                        <MenuItem value='markupPercentage'>Percentage</MenuItem>  
                                        <MenuItem value='markupPrice'>Price</MenuItem>  
                                    </TextField>
                                    {markup.type === 'markupPercentage' ?
                                        <TextField
                                            disabled={isApproved}
                                            fullWidth
                                            label='Markup Percentage'
                                            type='number'
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                            name='percentage'
                                            value={markup.percentage}
                                            onChange={handleMarkup}
                                            required
                                        />
                                    :
                                        <TextField
                                            disabled={isApproved || markup.type === ''}
                                            fullWidth 
                                            label='Markup Price'
                                            name='price'
                                            value={markup.price}
                                            onChange={handleMarkup}
                                        />  
                                    }
                                    <Button disabled={markup.type === ''} onClick={handleApplyMarkup} variant='contained'>Apply</Button>
                                </Stack>
                            </Grid>
                            
                            <Grid item xs={12} md={12}>
                                {currentItem.length > 0 ?
                                    <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', }}>Current Item Product</Typography>
                                        <Table stickyHeader aria-label="simple table">
                                            <TableHead>
                                                <TableRow
                                                    sx={{
                                                        "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                        "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                        bgcolor: '#d6e9ff'
                                                    }}
                                                >
                                                    <TableCellHeaderColor padding="checkbox">
                                                        <Checkbox
                                                            disabled={isApproved}
                                                            color="primary"
                                                            indeterminate={selected.length > 0 && selected.length < item.length}
                                                            checked={item.length > 0 && selected.length === item.length}
                                                            onChange={handleSelectAllClick}
                                                            inputProps={{
                                                                'aria-label': 'select all desserts',
                                                            }}
                                                        />
                                                    </TableCellHeaderColor>
                                                    <TableCellHeaderColor>No.</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Item Name</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Size</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Unit</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Quantity</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Unit Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>VAT Buy</TableCellHeaderColor>
                                                    <TableCellHeaderColor>New Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Markup Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Markup Percentage</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Sell Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Amount</TableCellHeaderColor>
                                                    <TableCellHeaderColor>T/NT</TableCellHeaderColor>
                                                    <TableCellHeaderColor>VAT</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Total</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Remarks</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Action</TableCellHeaderColor>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {renderItemDetails}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    : null
                                }
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <CustomGrandTotalComponent item={currentItem} markup={true} />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Stack direction='row' justifyContent='end' spacing={2}>
                                    {isApproved ?
                                        <Button onClick={() => navigate(`/file/${data?.id}/quotation`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
                                            Next
                                        </Button>
                                    :
                                        <LoadingButton endIcon={<Iconify icon='carbon:next-filled' />} loading={loadingSave} variant='contained' type='submit'>
                                            Next
                                        </LoadingButton>
                                    }
                                </Stack>
                            </Grid>
                        </>
                        : null
                        }
                    </Grid>
                </Card>
            </Box>
            <ConfirmDialog 
                handleClick={handleClickModalEdit}
                title='Edit'
                handleClose={() => setModalConfirmEdit(false)}
                open={modalConfirmEdit}
            />
        </Stack>
    )
}

export default Form