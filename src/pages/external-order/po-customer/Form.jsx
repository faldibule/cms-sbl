import ConfirmDialog from '@components/ConfirmDialog'
import CustomAutocomplete from '@components/CustomAutocomplete'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import Iconify from '@components/Iconify'
import Loading from '@components/Loading'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import DeletedTableRow from '@components/po-catering/DeletedTableRow'
import TableInputRow from '@components/po-customer/TableInputRow'
import useFetchDiscount from '@hooks/discount/useFetchDiscount'
import useSavePOCustomer from '@hooks/po-customer/useSavePOCustomer'
import useFetchQuotation from '@hooks/quotation/useFetchQuotation'
import useFetchQuotationById from '@hooks/quotation/useFetchQuotationById'
import useIsStoreKeeper from '@hooks/useIsStoreKeeper'
import useFetchUser from '@hooks/user-list/useFetchUser'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Form = (props) => {
    const { data } = props

    const approvalMemo = useMemo(() => {
        return {
            isApproved1: !!data?.approved1_date,
            approved1_date: data?.approved1_date,

            isApproved2: !!data?.approved2_date,
            approved2_date: data?.approved2_date
        }
    }, [data])

    const isUserStoreKeeper = useIsStoreKeeper()
    const navigate = useNavigate()

    const [item, setItem] = useState([])
    const [isEdit, setIsEdit] = useState(false)
 
    const isApproved = useMemo(() => {
        if(!data) return false
        if(!isEdit) return data.status === 'finish'

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

    // Quotation Handle
    const [quotationState, setQuotationState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedQuotation = (value) => setQuotationState({...quotationState, selected: value})
    const handleInputQuotation = (value) => setQuotationState({...quotationState, input: value})
    const { data: dataQuotationList, isLoading: loadingQuotationList } = useFetchQuotation({ paginate: 0, status: ['finish'] })
    const { data: dataQuotationById, isLoading: loadingQuotationById } = useFetchQuotationById(quotationState.selected?.id, { enabled: !!quotationState.selected?.id })

    useEffect(() => {
        let mounted = true
        if(!!!quotationState.selected?.id) return
        if(!!!dataQuotationById) return
        if(!mounted) return 

        if(props.title === 'edit' && quotationState.selected?.id === data.quotation?.id){
            setItem([...data.item_product])
            return
        }

        setItem([...dataQuotationById.item_product])

        return () => mounted = false

    }, [quotationState.selected, dataQuotationById])

    // User Handle
    const [userState, setUserState] = useState({
        prepared_by: {
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

    // Get product that exist in PR but not exist in PO
    const differenceProductPRtoPO = useMemo(() => {
        if(!dataQuotationById) return []

        const tempIdProductQuotation = item.map(v => v.item_product.id)
        return dataQuotationById.item_product.filter(v => !tempIdProductQuotation.includes(v.item_product.id))
    }, [dataQuotationById, item])

    // Get product that exist in PO but not exist in PR (deleted)
    const differenceProductPOtoPR = useMemo(() => {
        if(!dataQuotationById) return []

        // get all product id from PR
        const tempIdProductQuotation = dataQuotationById.item_product.map(v => v.item_product.id)

        return item.filter(v => !tempIdProductQuotation.includes(v.item_product.id))
    }, [dataQuotationById, item])

    const itemFiltered = useMemo(() => {
        if(!data) return item
        if(!dataQuotationById) return []

        // get all product id from PR
        const tempIdProductQuotation = dataQuotationById.item_product.map(v => v.item_product.id)

        return [...item.filter(v => tempIdProductQuotation.includes(v.item_product.id)), ...differenceProductPRtoPO]
    }, [dataQuotationById, item, differenceProductPRtoPO])
    

    const { mutate: save, isLoading: loadingSave, error  } = useSavePOCustomer({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('quotation_id', quotationState.selected?.id)
        formData.append('prepared_by', userState.prepared_by.selected?.id)
        formData.append('approved1_by', userState.approved1_by.selected?.id)
        formData.append('approved2_by', userState.approved2_by.selected?.id)
        itemFiltered.forEach((v, i) => {
            const price = parseInt(v?.price) || parseInt(v?.item_price)
            const item_product_id = v.item_product?.id

            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][description]`, v?.description)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][quantity]`, v.quantity)
            formData.append(`item_product[${i}][vat]`, !!v.vat ? v.vat : 11)
            formData.append(`item_product[${i}][remark]`, !!v.remark ? v.remark : '')
        })
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                setQuotationState({
                    input: data.quotation?.quotation_number,
                    selected: data.quotation
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

    if(loadingUser || loadingDiscount || loadingQuotationList){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Stack direction='row' justifyContent='space-between'>
                        <Stack>
                            <Typography variant='h5'>
                                {props.title === 'add' ? 'Form Input PO Customer' : 'Form Edit PO Customer' }
                            </Typography>
                            {!!data ? 
                                <Typography fontStyle='italic' variant='body2' fontWeight='bold'>
                                    {data?.po_number}
                                </Typography>
                            : null}
                        </Stack>
                        {!!data && data?.status === 'finish' && isUserStoreKeeper ?
                            <Button onClick={() => handleEditButton()} variant='contained' color='primary' sx={{ height: '5dvh' }}>
                                {isEdit ? 'Cancel Edit' : 'Edit Data PO Customer'}
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
                                options={dataQuotationList?.data || []}
                                getOptionLabel={(option) => `${option.quotation_number}`}
                                label='Quotation Number'
                                inputValue={quotationState.input}
                                setInputValue={handleInputQuotation}
                                selectedValue={quotationState.selected}
                                setSelectedValue={handleSelectedQuotation}
                                errors={errors?.quotation_id}
                            /> 
                        </Grid>
                        {!!quotationState.selected?.id ?
                        <>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled
                                fullWidth
                                label="Request Date"
                                value={!!dataQuotationById?.pr_customer?.request_date ? moment(dataQuotationById?.pr_customer?.request_date).format('LL') : 'Loading...'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled
                                fullWidth
                                label="Delivery Date"
                                value={!!dataQuotationById?.pr_customer?.delivery_date ? moment(dataQuotationById?.pr_customer?.delivery_date).format('LL') : 'Loading...'}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField 
                                label='Location'
                                fullWidth
                                disabled
                                value={dataQuotationById?.pr_customer?.location?.location || 'Loading....'}
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
                        <Grid item xs={12} md={12}>
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
                        <Grid item xs={12} md={approvalMemo.isApproved1 ? 3 : 6}>
                            <CustomAutocomplete 
                                disabled={isApproved || approvalMemo.isApproved1}
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
                        {approvalMemo.isApproved1 ?
                            <Grid item xs={12} md={3}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Approved 1 On"
                                    value={moment(approvalMemo?.approved1_date).format('LL') || ''}
                                />
                            </Grid>
                        : null
                        }
                        <Grid item xs={12} md={approvalMemo.isApproved2 ? 3 : 6}>
                            <CustomAutocomplete 
                                disabled={isApproved || approvalMemo.isApproved2}
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
                        {approvalMemo.isApproved2 ?
                            <Grid item xs={12} md={3}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Approved 2 On"
                                    value={moment(approvalMemo?.approved2_date).format('LL') || ''}
                                />
                            </Grid>
                        : null
                        }

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

                        <Grid item xs={12} md={12}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', my: 2 }}>Current Item Product</Typography>
                            {itemFiltered.length > 0 ? 
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
                                            {itemFiltered.map((v, i) => <TableInputRow isApproved={isApproved} errors={errors} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            : 
                            null
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <CustomGrandTotalComponent item={itemFiltered} discount={discount.value} />
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                {isApproved ?
                                    <Button onClick={() => navigate(`/file/${data?.id}/po_customer`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
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
                <ConfirmDialog 
                    handleClick={handleClickModalEdit}
                    title='Edit'
                    handleClose={() => setModalConfirmEdit(false)}
                    open={modalConfirmEdit}
                />
            </Box>
        </Stack>
    )
}

export default Form