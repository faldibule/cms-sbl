import CustomAutocomplete from '@components/CustomAutocomplete'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import Iconify from '@components/Iconify'
import Loading from '@components/Loading'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import TableInputRow from '@components/po-catering/TableInputRow'
import useFetchDiscount from '@hooks/discount/useFetchDiscount'
import useSavePOCatering from '@hooks/po-catering/useSavePOCatering'
import useFetchPRCatering from '@hooks/pr-catering/useFetchPRCatering'
import useFetchPRCateringById from '@hooks/pr-catering/useFetchPRCateringById'
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
        return data.status === 'finish'
    }, [data])

    const approvalMemo = useMemo(() => {
        return {
            isChecked: !!data?.checked_date,
            checked_date: data?.checked_date,

            isApproved1: !!data?.approved1_date,
            approved1_date: data?.approved1_date,

            isApproved2: !!data?.approved2_date,
            approved2_date: data?.approved2_date
        }
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState([])

    // PR Handle
    const [prCateringState, setPRCateringState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedPRCatering = (value) => setPRCateringState({...prCateringState, selected: value})
    const handleInputPRCatering = (value) => setPRCateringState({...prCateringState, input: value})
    const { data: dataPRCateringList, isLoading: loadingPRCateringList } = useFetchPRCatering({ paginate: 0 })
    const { data: dataPRCateringById, isLoading: loadingPRCateringById } = useFetchPRCateringById(prCateringState.selected?.id, { enabled: !!prCateringState.selected?.id })

    useEffect(() => {
        let mounted = true
        if(!!!prCateringState.selected?.id) return
        if(!!!dataPRCateringById) return
        if(!mounted) return 

        if(props.title === 'edit' && prCateringState.selected?.id === data.pr_catering?.id){
            setItem([...data.item_product])
            return
        }

        setItem([...dataPRCateringById.item_product])

        return () => mounted = false

    }, [prCateringState.selected, dataPRCateringById])

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

    const { mutate: save, isLoading: loadingSave, error  } = useSavePOCatering({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('pr_catering_id', prCateringState.selected?.id)
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
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                setPRCateringState({
                    input: data.pr_catering?.pr_number,
                    selected: data.pr_catering
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

    if(loadingPRCateringList || loadingUser || loadingDiscount){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input PO Catering' : 'Form Edit PO Catering' }
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
                                options={dataPRCateringList?.data || []}
                                getOptionLabel={(option) => `${option.pr_number}`}
                                label='PR Catering Number'
                                inputValue={prCateringState.input}
                                setInputValue={handleInputPRCatering}
                                selectedValue={prCateringState.selected}
                                setSelectedValue={handleSelectedPRCatering}
                                errors={errors?.pr_catering_id}
                            /> 
                        </Grid>
                        {!!prCateringState.selected?.id ?
                        <>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled
                                fullWidth
                                label="Request Date"
                                value={!!dataPRCateringById?.request_date ?moment(dataPRCateringById?.request_date).format('LL') : 'Loading...'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled
                                fullWidth
                                label="Delivery Date"
                                value={!!dataPRCateringById?.delivery_date ?moment(dataPRCateringById?.delivery_date).format('LL') : 'Loading...'}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField 
                                label='Location'
                                fullWidth
                                disabled
                                value={dataPRCateringById?.location?.location || 'Loading....'}
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
                        <Grid item xs={12} md={approvalMemo.isChecked ? 3 : 6}>
                            <CustomAutocomplete 
                                disabled={isApproved || approvalMemo.isChecked}
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
                                                <TableCellHeaderColor>Total Tax</TableCellHeaderColor>
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
                                    <Button onClick={() => navigate(`/file/${data?.id}/po_catering`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
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