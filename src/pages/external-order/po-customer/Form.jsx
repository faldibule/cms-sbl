import CustomAutocomplete from '@components/CustomAutocomplete'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import Iconify from '@components/Iconify'
import Loading from '@components/Loading'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import TableInputRow from '@components/po-catering/TableInputRow'
import useFetchDiscount from '@hooks/discount/useFetchDiscount'
import useSavePOCustomer from '@hooks/po-customer/useSavePOCustomer'
import useFetchQuotation from '@hooks/quotation/useFetchQuotation'
import useFetchQuotationById from '@hooks/quotation/useFetchQuotationById'
import useFetchUser from '@hooks/user-list/useFetchUser'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Form = (props) => {
    const { data } = props
    const isApproved = useMemo(() => {
        if(!!!data) return false
        return data.status === 'submit'
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState([])
    const [form, setForm] = useState({
        item: '',
    })

    // Quotation Handle
    const [quotationState, setQuotationState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedQuotation = (value) => setQuotationState({...quotationState, selected: value})
    const handleInputQuotation = (value) => setQuotationState({...quotationState, input: value})
    const { data: dataQuotationList, isLoading: loadingQuotationList } = useFetchQuotation({ paginate: 0 })
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

    const { mutate: save, isLoading: loadingSave, error  } = useSavePOCustomer({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('quotation_id', quotationState.selected?.id)
        formData.append('prepared_by', userState.prepared_by.selected?.id)
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
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input PO Customer' : 'Form Edit PO Customer' }
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
                            <CustomGrandTotalComponent item={item} discount={discount.value} />
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
            </Box>

        </Stack>
    )
}

export default Form