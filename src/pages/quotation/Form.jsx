import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '../../hooks/useCustomSnackbar'
import { NumberFormat } from '../../utils/Format'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import TableInputRow from '@components/quotation/TableInputRow'
import { read, utils } from 'xlsx'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import useFetchCustomer from '@hooks/customer/useFetchCustomer'
import useFetchUser from '@hooks/user-list/useFetchUser'
import Loading from '@components/Loading'
import useFetchPricelist from '@hooks/pricelist/useFetchPricelist'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSaveQuotation from '@hooks/quotation/useSaveQuotation'

const Form = (props) => {
    const { data } = props
    const [defaultValue, setDefaultValue] = useState({})
    const [item, setItem] = useState([])
    const [form, setForm] = useState({
        item: '',
        vat: 0,
        document: {
            file: '',
            file_name: '',
            file_url: '',
        }
    })

    const [customerState, setCustomerState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedCustomer = (value) => setCustomerState({ ...customerState, selected: value })
    const handleInputCustomer = (value) => setCustomerState({ ...customerState, input: value })
    const { data: dataCustomer, isLoading: loadingCustomer } = useFetchCustomer({ paginate: 0 })

    const [userState, setUserState] = useState({
        prepared_by: {
            input: '',
            selected: null
        },
        checked_by: {
            input: '',
            selected: null
        },
        approved_by: {
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

    const [itemState, setItemState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedItem = (value) => setItem([...item, value])
    const handleInputItem = (value) => setItemState({ ...itemState, input: value })
    const { data: dataPricelist, isLoading: loadingPricelist } = useFetchPricelist({ paginate: 0 })

    const handleFile = (e) => {
        if (e.target.files[0] !== undefined) {
            const file = e.target.files[0]
            const file_url = URL.createObjectURL(file)
            const file_name = file.name
            setForm({
                ...form,
                document: {
                    file,
                    file_name,
                    file_url
                }
            })
            e.target.value = null;
         }
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onChangeItem = (e) => {
        setForm({
            ...form,
            item: ''
        })
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

    const [importLoading, setImportLoading] = useState(false)
    const handleFileImport = (e) => {
        e.preventDefault()
        setImportLoading(true)
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = utils.sheet_to_json(worksheet);
                setItem([...json])
            };
            reader.onloadend = () => {
                setImportLoading(false)
            };
            reader.readAsArrayBuffer(e.target.files[0]);
            e.target.value = null;
        }
    }

    const { mutate: save, isLoading: loadingSave, error  } = useSaveQuotation({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('customer_id', customerState.selected?.id)
        formData.append('prepared_by', userState.prepared_by.selected?.id)
        formData.append('checked_by', userState.checked_by.selected?.id)
        formData.append('approved_by', userState.approved_by.selected?.id)
        item.forEach((v, i) => {
            const name = v?.name || v?.item_product?.name || v?.item_name
            const price = parseInt(v?.price) || parseInt(v?.item_price)
            const unit = v.item_product?.unit?.param || v?.unit 
            formData.append(`item_product[${i}][item_name]`, name )
            formData.append(`item_product[${i}][weight]`, v?.weight)
            formData.append(`item_product[${i}][unit]`, unit)
            formData.append(`item_product[${i}][quantity]`, v.quantity)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][vat]`, !!v.vat ? v.vat : 11)
            formData.append(`item_product[${i}][tnt]`, !!v.tnt ? v.tnt : '')
            formData.append(`item_product[${i}][remark]`, !!v.remark ? v.remark : '')
        })
        save({ formData, id: data?.id })
    }

    const [pageLoading, setPageLoading] = useState(props.title === 'add' ? false : true)
    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                setTimeout(() => {
                    handleInputCustomer(`${data?.customer.code} - ${data?.customer.name}`)
                    handleSelectedCustomer(data?.customer)

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
                        approved_by: {
                            input: data?.approved_by?.name,
                            selected: data?.approved_by,
                        }
                    })
                    setItem([...data?.item_product])

                    setPageLoading(false)
                }, 500);
            }
        }

        return () => mounted = false

    }, [props?.id])

    if(loadingCustomer || loadingUser || loadingPricelist || pageLoading){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        Form Quotation
                    </Typography>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
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
                                fullWidth 
                                label='Attention'
                                name='attention'
                                defaultValue={data?.attention}
                                required
                                helperText={!!errors?.attention && errors?.attention[0]}
                                error={!!errors?.attention}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Address'
                                name='address'
                                defaultValue={data?.address}
                                required
                                helperText={!!errors?.address && errors?.address[0]}
                                error={!!errors?.address}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                name='delivery_date'
                                label="Delivery Date"
                                defaultValue={data?.delivery_date}
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                required
                                helperText={!!errors?.delivery_date && errors?.delivery_date[0]}
                                error={!!errors?.delivery_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
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
                                label='Shipping Address'
                                name='shipping_address'
                                defaultValue={data?.shipping_address}
                                required
                                helperText={!!errors?.shipping_address && errors?.shipping_address[0]}
                                error={!!errors?.shipping_address}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                name='shipment_date'
                                label="Shipment Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                required
                                defaultValue={data?.shipment_date}
                                helperText={!!errors?.shipment_date && errors?.shipment_date[0]}
                                error={!!errors?.shipment_date}
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
                                getOptionLabel={(opt) => `${opt.name}`}
                                options={dataUser.data}
                                label='Checked By'
                                inputValue={userState.approved_by.input}
                                setInputValue={handleUser('approved_by', 'input')}
                                selectedValue={userState.approved_by.selected}
                                setSelectedValue={handleUser('approved_by', 'selected')}
                                errors={errors?.approved_by}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth 
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
                            <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                                <CustomAutocomplete 
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
                                <LoadingButton fullWidth loading={importLoading} component='label' sx={{ width: 120 }} variant='contained' startIcon={<Iconify icon='material-symbols:upload-rounded' />}>
                                    <input type='file' accept='.xlsx' onChange={handleFileImport} id='import' hidden />
                                    Import
                                </LoadingButton>
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
                                                <TableCellHeaderColor>Weight</TableCellHeaderColor>
                                                <TableCellHeaderColor>Unit</TableCellHeaderColor>
                                                <TableCellHeaderColor>Quantity</TableCellHeaderColor>
                                                <TableCellHeaderColor>Unit Price</TableCellHeaderColor>
                                                <TableCellHeaderColor>VAT</TableCellHeaderColor>
                                                <TableCellHeaderColor>Tax</TableCellHeaderColor>
                                                <TableCellHeaderColor>Total Price</TableCellHeaderColor>
                                                <TableCellHeaderColor>Grand Total</TableCellHeaderColor>
                                                <TableCellHeaderColor>T/NT</TableCellHeaderColor>
                                                <TableCellHeaderColor>Remarks</TableCellHeaderColor>
                                                <TableCellHeaderColor>Action</TableCellHeaderColor>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => <TableInputRow key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} errors={errors} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            : 
                            null
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <CustomGrandTotalComponent dummy={false} tax={false} item={item} />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={2}>
                                <LoadingButton loading={loadingSave} variant='contained' type='submit'>
                                    Submit
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

        </Stack>
    )
}

export default Form