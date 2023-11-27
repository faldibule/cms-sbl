import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate } from 'react-router-dom'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import TableInputRow from '@components/do-catering/TableInputRow'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import useFetchUser from '@hooks/user-list/useFetchUser'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useFetchPurchaseRequest from '@hooks/purchase-request/useFetchPurchaseRequest'
import Loading from '@components/Loading'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useFetchSupplier from '@hooks/supplier/useFetchSupplier'
import useFetchDiscount from '@hooks/discount/useFetchDiscount'
import useFetchPurchaseRequestById from '@hooks/purchase-request/useFetchPurchaseRequestById'
import useSaveDOCatering from '@hooks/do-catering/useSaveDOCatering'
import { POCustomerDummy, POSupplierCateringDummy, dummy_item_product } from '@utils/Dummy'

const Form = (props) => {
    const { data } = props
    const isApproved = useMemo(() => {
        if(!!!data) return false
        return data.status === 'finish'
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState(dummy_item_product)

    // PO Customer Handle
    const [poCustomerState, setPOCustomerState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedPOCustomer = (value) => setPOCustomerState({...poCustomerState, selected: value})
    const handleInputPOCustomer = (value) => setPOCustomerState({...poCustomerState, input: value})
    // const { data: dataPOCustomerList, isLoading: loadingPOCustomerList } = useFetchPurchaseRequest({ paginate: 0 })
    // const { data: dataPOCustomerById, isLoading: loadingPOCustomerById } = useFetchPurchaseRequestById(poSupplierCustomer.selected?.id, { enabled: !!poSupplierCustomer.selected?.id })
    // useEffect(() => {
    //         let mounted = true
    //         if(!!!poCustomer.selected?.id) return
    //         if(!!!dataPOCustomerById) return
    //         if(!mounted) return 

    //         if(props.title === 'edit' && poCustomer.selected?.id === data.purchase_request?.id){
    //             setItem([...data.item_product])
    //             return
    //         }

    //         setItem([...dataPOCustomerById.item_product])

    //         return () => mounted = false

    //     }, [poCustomer.selected, dataPOCustomerById])

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

    const deleteItemTable = (e, index) => {
        setItem([...item.filter((v, i) => i !== index)])
    }

    const { mutate: save, isLoading: loadingSave, error  } = useSaveDOCatering({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('purchase_request_id', prState.selected?.id)
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
            formData.append(`item_product[${i}][description]`, v?.description)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][quantity]`, v.quantity)
            formData.append(`item_product[${i}][vat]`, !!v.vat ? v.vat : 11)
            formData.append(`item_product[${i}][remark]`, !!v.remark ? v.remark : '')
        })
        // save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                // setPrState({
                //     input: data.purchase_request?.pr_number,
                //     selected: data.purchase_request
                // })
                // setSupplierState({
                //     input: data.supplier.name,
                //     selected: data.supplier
                // })
                // setLocationState({
                //     input: `${data.location.location_code} - ${data.location.location}`,
                //     selected: data.location
                // })
                // setDiscount({
                //     id: data?.discount?.id,
                //     value: data?.discount?.discount
                // })
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
                // setItem([...data.item_product])
            }
        }

        return () => mounted = false

    }, [props.id])

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

    if(loadingUser || loadingDiscount){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input DO Customer' : 'Form Edit DO Customer' }
                    </Typography>
                    {!!data ? 
                        <Typography fontStyle='italic' variant='body2' fontWeight='bold'>
                            {data?.do_number}
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
                                options={POCustomerDummy}
                                getOptionLabel={(option) => `${option.po_customer_number}`}
                                label='PO Customer Number'
                                inputValue={poCustomerState.input}
                                setInputValue={handleInputPOCustomer}
                                selectedValue={poCustomerState.selected}
                                setSelectedValue={handleSelectedPOCustomer}
                                errors={errors?.po_customer}
                            /> 
                        </Grid>
                        {!!poCustomerState.selected?.id ?
                        <>
                        <Grid item xs={12} md={12}>
                            <TextField 
                                label='Supplier'
                                name='supplier'
                                disabled
                                defaultValue='PT.Terakom'
                                fullWidth
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
                        <Grid item xs={12} md={12}>
                            <TextField 
                                label='Location'
                                name='location'
                                disabled
                                defaultValue='HO Jakarta'
                                fullWidth
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
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled={isApproved}
                                fullWidth 
                                label='Term & Conditions'
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
                            <TextField
                                disabled={isApproved}
                                fullWidth 
                                label='Term of Payment'
                                multiline
                                rows={3}
                                name='term_payment'
                                defaultValue={data?.term_payment}
                                required
                                helperText={!!errors?.term_payment && errors?.term_payment[0]}
                                error={!!errors?.term_payment}
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
                                                <TableCellHeaderColor>Item Brand</TableCellHeaderColor>
                                                <TableCellHeaderColor>Description</TableCellHeaderColor>
                                                <TableCellHeaderColor>Size</TableCellHeaderColor>
                                                <TableCellHeaderColor>Unit</TableCellHeaderColor>
                                                <TableCellHeaderColor>Price</TableCellHeaderColor>
                                                <TableCellHeaderColor>Quantity</TableCellHeaderColor>
                                                <TableCellHeaderColor>VAT</TableCellHeaderColor>
                                                <TableCellHeaderColor>Tax</TableCellHeaderColor>
                                                <TableCellHeaderColor>Total Price</TableCellHeaderColor>
                                                <TableCellHeaderColor>Grand Total</TableCellHeaderColor>
                                                <TableCellHeaderColor>Remarks</TableCellHeaderColor>
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
                                <Button onClick={() => navigate(`/file/${data?.id}/catering_po`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
                                    Next
                                </Button>
                                {/* {isApproved ?
                                    <Button onClick={() => navigate(`/file/${data?.id}/catering_po`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
                                        Next
                                    </Button>
                                :
                                    <LoadingButton endIcon={<Iconify icon='carbon:next-filled' />} loading={loadingSave} variant='contained' type='submit'>
                                        Next
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

        </Stack>
    )
}

export default Form