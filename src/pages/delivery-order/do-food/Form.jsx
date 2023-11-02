import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import { IntegerFormat } from '@utils/Format'
import TableInputRow from '@components/do-food/TableInputRow'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import { read, utils } from 'xlsx'
import useFetchUser from '@hooks/user-list/useFetchUser'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useFetchPricelist from '@hooks/pricelist/useFetchPricelist'
import Loading from '@components/Loading'
import useFetchCustomer from '@hooks/customer/useFetchCustomer'
import useFetchPOMasuk from '@hooks/po-masuk/useFetchPOMasuk'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSaveDOFood from '@hooks/do-food/useSaveDOFood'
import ImportModal from '@components/ImportModal'

const Form = (props) => {
    const { data } = props
    const [item, setItem] = useState([])

    // Handle PO Masuk
    const [poState, setPoState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedPO = (value) => setPoState({ ...poState, selected: value })
    const handleInputPO = (value) => setPoState({ ...poState, input: value })
    const { data: dataPO, isLoading: loadingPO } = useFetchPOMasuk({ paginate: 0 })

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
        received_by: {
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

    // Handle Location
    const [locationState, setLocationState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedLocation = (value) => setLocationState({...locationState, selected: value})
    const handleInputLocation = (value) => setLocationState({...locationState, input: value})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({ paginate: 0 })

    // Handle Item Product
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

    const { mutate: save, isLoading: loadingSave, error  } = useSaveDOFood({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('incoming_po_id', poState.selected?.id)
        formData.append('customer_id', customerState.selected?.id)
        formData.append('location_id', locationState.selected?.id)
        formData.append('prepared_by', userState.prepared_by.selected?.id)
        formData.append('received_by', userState.received_by.selected?.id)
        item.forEach((v, i) => {
            const item_product_id = v.item_product?.id
            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][description]`, !!v.description ? v.description : '')
            formData.append(`item_product[${i}][quantity]`, !!v.quantity ? v.quantity : '')
        })
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                setPoState({
                    input: data.incoming_po.po_number,
                    selected: data.incoming_po
                })
                setCustomerState({
                    input: data.customer.name,
                    selected: data.customer
                })
                setLocationState({
                    input: data.location.location,
                    selected: data.location
                })
                setUserState({
                    prepared_by: {
                        input: data.prepared_by.name,
                        selected: data.prepared_by
                    },
                    received_by: {
                        input: data.received_by.name,
                        selected: data.received_by
                    }
                })
                setItem([...data.item_product])
            }
        }

        return () => mounted = false

    }, [props])

    if(loadingPO || loadingCustomer || loadingUser || loadingLocation){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input DO Keluar Food Supply' : 'Form Edit DO Keluar Food Supply' }
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
                                getOptionLabel={(opt) => `${opt.po_number}`}
                                options={dataPO.data}
                                label='PO Number'
                                inputValue={poState.input}
                                setInputValue={handleInputPO}
                                selectedValue={poState.selected}
                                setSelectedValue={handleSelectedPO}
                                errors={errors?.incoming_po_id}
                            />
                        </Grid>
                        {!!poState.selected?.id ? 
                        <>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                getOptionLabel={(opt) => `${opt.code} - ${opt.name}`}
                                options={dataCustomer.data}
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
                                type='date'
                                label="Delivery Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                defaultValue={data?.delivery_date}
                                name='delivery_date'
                                helperText={!!errors?.delivery_date && errors?.delivery_date[0]}
                                error={!!errors?.delivery_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth 
                                label='Address'
                                name='address'
                                defaultValue={data?.address}
                                required
                                multiline
                                rows={3}
                                helperText={!!errors?.address && errors?.address[0]}
                                error={!!errors?.address}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <CustomAutocomplete 
                                options={dataLocation.data}
                                getOptionLabel={(option) => `${option.location_code} - ${option.location}`}
                                label='Ship to'
                                inputValue={locationState.input}
                                setInputValue={handleInputLocation}
                                selectedValue={locationState.selected}
                                setSelectedValue={handleSelectedLocation}
                                errors={errors?.location_id}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
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
                                getOptionLabel={(opt) => `${opt.name}`}
                                options={dataUser.data}
                                label='Receieved By'
                                inputValue={userState.received_by.input}
                                setInputValue={handleUser('received_by', 'input')}
                                selectedValue={userState.received_by.selected}
                                setSelectedValue={handleUser('received_by', 'selected')}
                                errors={errors?.received_by}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                                <CustomAutocomplete 
                                    getOptionLabel={(opt) => `${opt.item_product.code} - ${opt.item_product.name}`}
                                    options={dataPricelist?.data || []}
                                    label='Item'
                                    inputValue={itemState.input}
                                    setInputValue={handleInputItem}
                                    selectedValue={null}
                                    setSelectedValue={handleSelectedItem}
                                    isAutoCompleteItem={true}
                                    size='small'
                                    disabled={!dataPricelist || dataPricelist?.data?.length === 0}
                                />
                                <Button onClick={handleModalImport} fullWidth sx={{ width: 120 }} variant='contained' startIcon={<Iconify icon='material-symbols:upload-rounded' />}>
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
                                                <TableCellHeaderColor>Brand</TableCellHeaderColor>
                                                <TableCellHeaderColor>Description</TableCellHeaderColor>
                                                <TableCellHeaderColor>Size</TableCellHeaderColor>
                                                <TableCellHeaderColor>Unit</TableCellHeaderColor>
                                                <TableCellHeaderColor>Quantity</TableCellHeaderColor>
                                                <TableCellHeaderColor>Action</TableCellHeaderColor>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => <TableInputRow errors={errors} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            : 
                            null
                            }
                        </Grid>
                        </>
                        : null}
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                <LoadingButton endIcon={<Iconify icon='carbon:next-filled' />} loading={loadingSave} variant='contained' type='submit'>
                                    Next
                                </LoadingButton>
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
                title='Product DO Keluar Food Supply'
                url={'read-excel/product-price'}
                onSuccessImport={onSuccessImport}
            />
        </Stack>
    )
}

export default Form