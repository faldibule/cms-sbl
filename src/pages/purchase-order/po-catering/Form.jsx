import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '../../../hooks/useCustomSnackbar'
import { NumberFormat } from '../../../utils/Format'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import TableInputRow from '@components/po-catering/TableInputRow'

const itemData = [
    {
        code: '1',
        name: 'item 1',
        brand: 'brand 1',
        description: '',
        harga: 1000000,
        quantity: 0,
        vat: 11,
        total: 1000000,
        grand_total: 1000000,
        status: false,
    },
    {
        code: '2',
        name: 'item 2',
        brand: 'brand 2',
        description: '',
        harga: 2000000,
        quantity: 0,
        vat: 11,
        total: 2000000,
        grand_total: 2000000,
        status: true,
    },
    {
        code: '3',
        name: 'item 3',
        brand: 'brand 3',
        description: '',
        harga: 3000000,
        quantity: 0,
        vat: 11,
        total: 3000000,
        grand_total: 3000000,
        status: false,
    }
]

let itemDataEdit = []
for(let i = 0; i < 4; i++){
    const index = i + 1
    itemDataEdit[i] = {
        code: i + index,
        name: 'item '+ index,
        brand: 'brand '+ index,
        description: 'Description '+ index,
        harga: index * 1000000,
        quantity: 5 + index,
        vat: 11,
        total: 0,
        shipment_charge: 0,
        grand_total: 0,
        status: true,
    }
}

const Form = (props) => {
    const sb = useCustomSnackbar()
    const navigate = useNavigate()
    const [item, setItem] = useState([])
    const [form, setForm] = useState({
        item: '',
        document: {
            file: '',
            file_name: '',
            file_url: '',
        }
    })

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

    const onChangeItem = (e) => {
        setForm({
            ...form,
            item: ''
        })
        setItem([...item, itemData.find(v => v.code === e.target.value)])
    }

    const onChangeItemTable = (e, id) => {
        const newItem = item.map((v, i) => {
            if(v.code === id){
                return {
                    ...v,
                    [e.target.name]: e.target.value,
                }
            }
            return v
        })
        setItem([...newItem])
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

    const onChangeCheckTable = (e, id) => {
        const newItem = item.map((v, i) => {
            if(v.code === id){
                return {
                    ...v,
                    status: e.target.checked
                }
            }
            return v
        })
        setItem([...newItem])
    }

    const onSubmit = (e) => {
        e.preventDefault()
        sb.success('Success!')
        navigate('/purchase-order/po-catering', {
            variant: 'success'
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                setItem([...itemDataEdit])
            }
        }

        return () => mounted = false

    }, [props])

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'input' ? 'Form Input PO Catering' : 'Form Edit PO Catering' }
                    </Typography>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='PR Number'
                                select
                                value={form.item}
                                onChange={(e) => { 
                                    setForm({ ...form, item: e.target.value }); 
                                    setItem([...itemDataEdit]); 
                                }}
                            >
                                <MenuItem value='1'>PR Number 1</MenuItem>
                                <MenuItem value='2'>PR Number 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='PO Number'
                            /> 
                        </Grid> 
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Supplier'
                                select
                            >
                                <MenuItem value='1'>Supplier 1</MenuItem>
                                <MenuItem value='2'>Supplier 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Attn Name'
                            /> 
                        </Grid> 
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                name='request_date'
                                label="Request Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                name='delivery_date'
                                label="Delivery Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Location'
                                select
                            >
                                <MenuItem value='1'>Location 1</MenuItem>
                                <MenuItem value='2'>Location 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Discount'
                                select
                            >
                                <MenuItem value='1'>5%</MenuItem>
                                <MenuItem value='2'>10%</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Term & Conditions'
                                multiline
                                rows={3}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Term of Payment'
                                multiline
                                rows={3}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Prepared By'
                                select
                            >
                                <MenuItem value='1'>User 1</MenuItem>
                                <MenuItem value='2'>User 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Acknowledge By'
                                select
                            >
                                <MenuItem value='1'>User 1</MenuItem>
                                <MenuItem value='2'>User 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Approved By'
                                select
                            >
                                <MenuItem value='1'>User 1</MenuItem>
                                <MenuItem value='2'>User 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {form.document.file_url === '' ?
                                <Button size="large" variant="outlined" component="label" fullWidth startIcon={<Iconify icon='ic:baseline-upload' />}>
                                    Add Supporting Document *
                                    <input name="document" type="file" onChange={handleFile} hidden />
                                </Button>
                            :
                                <TextField
                                    variant="outlined"
                                    label="Supporting Document *"
                                    sx={{ mb: 2 }}
                                    value={form.document.file_name}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Iconify icon='fluent:hard-drive-20-filled' />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => setForm({...form, document: { file_url: '', file: '', file_name: '' }})}>
                                                    <Iconify icon='zondicons:close-solid' />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                        ),
                                    }}
                                    fullWidth
                                    disabled
                                />
                            }
                        </Grid>
                        
                        <Grid item xs={12} md={12}>
                            {item.length > 0 ? 
                                <TableContainer sx={{ maxWidth: 2000 }}>
                                    <Table sx={{ minWidth: 1500, overflowX: 'auto' }} aria-label="simple table">
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
                                                <TableCell>No.</TableCell>
                                                <TableCell>Item Name</TableCell>
                                                <TableCell>Item Brand</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Harga</TableCell>
                                                <TableCell>Current Stock</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>VAT</TableCell>
                                                <TableCell>Tax</TableCell>
                                                <TableCell>Total Price</TableCell>
                                                {/* <TableCell>Shipment Charge</TableCell> */}
                                                <TableCell>Grand Total</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => <TableInputRow key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            : 
                            null
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <CustomGrandTotalComponent tax={false} item={item} />
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={2}>
                                <LoadingButton variant='contained' type='submit'>
                                    Submit
                                </LoadingButton>
                                {props.title == 'edit' ?
                                    <LoadingButton startIcon={<Iconify icon='material-symbols:print' />} variant='contained' type='button' sx={{ ml: 'auto' }}>
                                        Print
                                    </LoadingButton>
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