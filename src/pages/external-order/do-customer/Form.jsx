import ConfirmDialog from '@components/ConfirmDialog'
import CustomAutocomplete from '@components/CustomAutocomplete'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import Iconify from '@components/Iconify'
import Loading from '@components/Loading'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import TableInputRow from '@components/do-catering/TableInputRow'
import DeletedTableRow from '@components/po-catering/DeletedTableRow'
import useSaveDOCustomer from '@hooks/do-customer/useSaveDOCustomer'
import useFetchPOCustomer from '@hooks/po-customer/useFetchPOCustomer'
import useFetchPOCustomerById from '@hooks/po-customer/useFetchPOCustomerById'
import useFetchUser from '@hooks/user-list/useFetchUser'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Form = (props) => {
    const { data } = props
    const approvalMemo = useMemo(() => {
        return {
            isApproved: !!data?.approved_date,
            approved_date: data?.approved_date,
        }
    }, [data])

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

    // PO Customer Handle
    const [poCustomerState, setPOCustomerState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedPOCustomer = (value) => setPOCustomerState({...poCustomerState, selected: value})
    const handleInputPOCustomer = (value) => setPOCustomerState({...poCustomerState, input: value})
    const { data: dataPOCustomerList, isLoading: loadingPOCustomerList } = useFetchPOCustomer({ paginate: 0 })
    const { data: dataPOCustomerById, isLoading: loadingPOCustomerById } = useFetchPOCustomerById(poCustomerState.selected?.id, { enabled: !!poCustomerState.selected?.id })
    useEffect(() => {
            let mounted = true
            if(!!!poCustomerState.selected?.id) return
            if(!!!dataPOCustomerById) return
            if(!mounted) return 

            if(props.title === 'edit' && poCustomerState.selected?.id === data.po_customer?.id){
                setItem([...data.item_product])
                return
            }

            setItem([...dataPOCustomerById.item_product])

            return () => mounted = false

    }, [poCustomerState.selected, dataPOCustomerById])

    // User Handle
    const [userState, setUserState] = useState({
        approved_by: {
            input: '',
            selected: null
        }
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
        if(!dataPOCustomerById) return []

        const tempIdProductPOCustomer = item.map(v => v.item_product.id)
        return dataPOCustomerById.item_product.filter(v => !tempIdProductPOCustomer.includes(v.item_product.id))
    }, [dataPOCustomerById, item])

    // Get product that exist in PO but not exist in PR (deleted)
    const differenceProductPOtoPR = useMemo(() => {
        if(!dataPOCustomerById) return []

        // get all product id from PR
        const tempIdProductPOCustomer = dataPOCustomerById.item_product.map(v => v.item_product.id)

        return item.filter(v => !tempIdProductPOCustomer.includes(v.item_product.id))
    }, [dataPOCustomerById, item])

    const itemFiltered = useMemo(() => {
        if(!data) return item
        if(!dataPOCustomerById) return []

        // get all product id from PR
        const tempIdProductPOCustomer = dataPOCustomerById.item_product.map(v => v.item_product.id)

        return [...item.filter(v => tempIdProductPOCustomer.includes(v.item_product.id)), ...differenceProductPRtoPO]
    }, [dataPOCustomerById, item, differenceProductPRtoPO])
        
    const { mutate: save, isLoading: loadingSave, error  } = useSaveDOCustomer({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('po_customer_id', poCustomerState.selected?.id)
        formData.append('approved_by', userState.approved_by.selected?.id)
        formData.append('hard_edit', 'yes')
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
                setPOCustomerState({
                    input: data?.po_customer.po_number,
                    selected: data?.po_customer
                })
                setUserState({
                    ...userState,
                    approved_by: {
                        input: data?.approved_by?.name,
                        selected: data?.approved_by,
                    },
                })
                setItem([...data.item_product])
            }
        }

        return () => mounted = false

    }, [props.id])

    if(loadingUser || loadingPOCustomerList){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Stack direction='row' justifyContent='space-between'>
                        <Stack>
                            <Typography variant='h5'>
                                {props.title === 'add' ? 'Form Input DO Customer' : 'Form Edit DO Customer' }
                            </Typography>
                            {!!data ? 
                                <Typography fontStyle='italic' variant='body2' fontWeight='bold'>
                                    {data?.do_number}
                                </Typography>
                            : null}
                        </Stack>
                        {!!data && data?.status === 'finish' ?
                            <Button onClick={() => handleEditButton()} variant='contained' color='primary' sx={{ height: '5dvh' }}>
                                {isEdit ? 'Cancel Edit' : 'Edit Data DO Customer'}
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
                                options={dataPOCustomerList?.data || []}
                                getOptionLabel={(option) => `${option.po_number}`}
                                label='PO Customer Number'
                                inputValue={poCustomerState.input}
                                setInputValue={handleInputPOCustomer}
                                selectedValue={poCustomerState.selected}
                                setSelectedValue={handleSelectedPOCustomer}
                                errors={errors?.po_customer_id}
                            /> 
                        </Grid>
                        {!!poCustomerState.selected?.id ?
                        <>
                        <Grid item xs={12} md={12}>
                            <TextField 
                                disabled
                                label='Location'
                                fullWidth
                                value={dataPOCustomerById?.pr_customer?.location?.location || 'Loading....'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled
                                fullWidth
                                label="Request Date"
                                value={!!dataPOCustomerById?.pr_customer?.request_date ? moment(dataPOCustomerById?.pr_customer?.request_date).format('LL') : 'Loading...'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled
                                fullWidth
                                label="Delivery Date"
                                value={!!dataPOCustomerById?.pr_customer?.delivery_date ? moment(dataPOCustomerById?.pr_customer?.delivery_date).format('LL') : 'Loading...'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                disabled
                                label='Discount'
                                fullWidth
                                value={!!dataPOCustomerById ? `${dataPOCustomerById?.discount.discount}%` : 'Loading....'}
                            />
                        </Grid>
                        <Grid item xs={12} md={approvalMemo.isApproved ? 3 : 6}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                getOptionLabel={(opt) => `${opt.name}`}
                                options={dataUser.data}
                                label='Approved By'
                                inputValue={userState.approved_by.input}
                                setInputValue={handleUser('approved_by', 'input')}
                                selectedValue={userState.approved_by.selected}
                                setSelectedValue={handleUser('approved_by', 'selected')}
                                errors={errors?.approved_by}
                            />
                        </Grid>
                        {approvalMemo.isApproved ?
                            <Grid item xs={12} md={3}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Approved On"
                                    value={moment(approvalMemo?.approved_by).format('LL') || ''}
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
                            <CustomGrandTotalComponent discount={dataPOCustomerById?.discount.discount || 0} item={itemFiltered} />
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                {isApproved ?
                                    <Button onClick={() => navigate(`/file/${data?.id}/do_customer`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
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