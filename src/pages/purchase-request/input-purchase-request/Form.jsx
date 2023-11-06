import { LoadingButton } from '@mui/lab'
import { Autocomplete, Box, Button, Card, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import TableInputRow from '@components/input-purchase-request/TableInputRow'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import useFetchLocation from '@hooks/location/useFetchLocation'
import Loading from '@components/Loading'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSavePurchaseRequest from '@hooks/purchase-request/useSavePurchaseRequest'
import useFetchUser from '@hooks/user-list/useFetchUser'
import { useNavigate } from 'react-router-dom'
import ImportModal from '@components/ImportModal'
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct'

const Form = (props) => {
    const { data } = props
    const isApproved = useMemo(() => {
        if(!!!data) return false
        return data.status === 'finish'
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState([])

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

    const [locationState, setLocationState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedLocation = (value) => setLocationState({...locationState, selected: value})
    const handleInputLocation = (value) => setLocationState({...locationState, input: value})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({ paginate: 0 })

    const [itemState, setItemState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedItem = (value) => setItem([...item, value])
    const handleInputItem = (value) => setItemState({ ...itemState, input: value })
    const { data: dataItemProduct, isLoading: loadingItemProduct } = useFetchItemProduct({ paginate: 0, location_id: locationState.selected?.id || '' }, { enabled: !!locationState.selected?.id })

    // Handle Import
    const [modalImport, setModalImport] = useState(false)
    const handleModalImport = () => setModalImport(!modalImport)
    const onSuccessImport = (data) => {
        setItem([...data.data])
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

    const { mutate: save, isLoading: loadingSave, error  } = useSavePurchaseRequest({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('location_id', locationState.selected?.id)
        formData.append('prepared_by', userState.prepared_by.selected?.id)
        formData.append('checked_by', userState.checked_by.selected?.id)
        formData.append('approved1_by', userState.approved1_by.selected?.id)
        formData.append('approved2_by', userState.approved2_by.selected?.id)
        item.forEach((v, i) => {
            const name =  v?.name || v?.item_product?.name
            const brand = v?.brand || v?.item_product?.brand
            const size = v?.size || v?.item_product?.size
            const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price)
            const unit = v.item_product?.unit?.param || v?.unit?.param 
            const item_product_id = v?.item_product?.id || v?.id

            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][item_name]`, name)
            formData.append(`item_product[${i}][item_brand]`, brand)
            formData.append(`item_product[${i}][description]`, v?.description)
            formData.append(`item_product[${i}][size]`, size)
            formData.append(`item_product[${i}][unit]`, unit)
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
            if(!!props.data){
                setLocationState({
                    input: `${data.location.location_code} - ${data.location.location}`,
                    selected: data.location
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
                setItem([...data?.item_product])
            }
        }

        return () => mounted = false

    }, [props?.id])

    if(loadingLocation || loadingUser){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input Purchase Request' : 'Form Edit Purchase Request' }
                    </Typography>
                    {!!data ? 
                        <Typography fontStyle='italic' variant='body2' fontWeight='bold'>
                            {data?.pr_number}
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
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                disabled={isApproved}
                                label="PR Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                name='pr_date'
                                helperText={!!errors?.pr_date && errors?.pr_date[0]}
                                error={!!errors?.pr_date}
                                defaultValue={data?.pr_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                disabled={isApproved}
                                name='shipment_date'
                                label="Shipment Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                helperText={!!errors?.shipment_date && errors?.shipment_date[0]}
                                error={!!errors?.shipment_date}
                                defaultValue={data?.shipment_date}
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
                            <TextField
                                disabled={isApproved}
                                fullWidth 
                                label='Description'
                                name='description'
                                defaultValue={data?.description}
                                required
                                multiline
                                rows={3}
                                helperText={!!errors?.description && errors?.description[0]}
                                error={!!errors?.description}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                                <CustomAutocomplete 
                                    getOptionLabel={(opt) => `${opt.code} - ${opt.name}`}
                                    options={dataItemProduct?.data || []}
                                    label='Item'
                                    inputValue={itemState.input}
                                    setInputValue={handleInputItem}
                                    selectedValue={null}
                                    setSelectedValue={handleSelectedItem}
                                    isAutoCompleteItem={true}
                                    size='small'
                                    disabled={!dataItemProduct || dataItemProduct?.data?.length === 0 || isApproved}
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
                            <CustomGrandTotalComponent item={item} />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                {isApproved ?
                                    <Button onClick={() => navigate(`/file/${data?.id}/purchase_request`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
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
                title='Product Purchase Request'
                url={'read-excel/product-price'}
                onSuccessImport={onSuccessImport}
            />
        </Stack>
    )
}

export default Form