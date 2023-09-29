import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '../../hooks/useCustomSnackbar'
import { NumberFormat } from '../../utils/Format'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'

const itemData = [
    {
        code: '1',
        name: 'item 1',
        brand: 'brand 1',
        description: '',
        harga: 1000000,
        quantity: 0,
        tax: 11,
        total: 1000000,
        grand_total: 1000000,
        vat: 0,
    },
    {
        code: '2',
        name: 'item 2',
        brand: 'brand 2',
        description: '',
        harga: 2000000,
        quantity: 0,
        tax: 11,
        total: 2000000,
        grand_total: 2000000,
        vat: 0,
    },
    {
        code: '3',
        name: 'item 3',
        brand: 'brand 3',
        description: '',
        harga: 3000000,
        quantity: 0,
        tax: 11,
        total: 3000000,
        grand_total: 3000000,
        vat: 0,
    }
]

const itemDataEdit = [
    {
        code: '1',
        name: 'item 1',
        brand: 'brand 1',
        description: 'Test 1',
        harga: 1000000,
        quantity: 5,
        tax: 11,
        total: 1000000,
        grand_total: 1000000,
        vat: 0,
    },
    {
        code: '2',
        name: 'item 2',
        brand: 'brand 2',
        description: 'test 2',
        harga: 2000000,
        quantity: 3,
        tax: 11,
        total: 2000000,
        grand_total: 2000000,
        vat: 0,
    },
    {
        code: '3',
        name: 'item 3',
        brand: 'brand 3',
        description: 'test 3',
        harga: 3000000,
        quantity: 1,
        tax: 11,
        total: 3000000,
        grand_total: 3000000,
        vat: 0,
    }
]

const Form = (props) => {
    const sb = useCustomSnackbar()
    const navigate = useNavigate()
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
        setItem([...item, itemData.find(v => v.code === e.target.value)])
    }

    const onChangeItemTable = (e, id) => {
        const newItem = item.map((v, i) => {
            if(v.code === id){
                if(e.target.name === 'vat'){
                    return {
                        ...v,
                        vat: e.target.value.replaceAll('Rp', '').replaceAll('.', '')
                    }
                }
                return {
                    ...v,
                    [e.target.name]: e.target.value,
                }
            }
            return v
        })
        setItem([...newItem])
    }

    const deleteItemTable = (e, id) => {
        setItem([...item.filter(v => v.code !== id)])
    }

    const onSubmit = (e) => {
        e.preventDefault()
        sb.success('Success!')
        navigate('/quotation', {
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
                        Form Quotation
                    </Typography>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Customer'
                                select
                            >
                                <MenuItem value='1'>Customer 1</MenuItem>
                                <MenuItem value='2'>Customer 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Attention'
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Address'
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
                                label='Vessel'
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Shipping Address'
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
                                label='Checked By'
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
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth 
                                label='Term & Condition'
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                label='Item'
                                value={form.item}
                                onChange={onChangeItem}
                                fullWidth 
                                select
                            >
                                {itemData.map((v, i) => {
                                    return (
                                        <MenuItem disabled={!!item.find(i => i.code == v.code)} key={v.code} value={v.code}>{v.name}</MenuItem>
                                    )
                                })}
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {item.length > 0 ? 
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                    bgcolor: '#d6e9ff'
                                                }}
                                            >
                                                <TableCell>No.</TableCell>
                                                <TableCell>Item Name</TableCell>
                                                <TableCell>Item Brand</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Unit</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>VAT</TableCell>
                                                <TableCell>Total Price</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => {
                                                const total = v.harga * v.quantity
                                                const grand_total = total + parseInt(v.vat)
                                                console.log(v.vat)
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>{i + 1}</TableCell>
                                                        <TableCell>{v.name}</TableCell>
                                                        <TableCell>{v.brand}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                fullWidth 
                                                                sx={{ width: 300 }}
                                                                label='Description'
                                                                name='description'
                                                                value={v.description}
                                                                onChange={(e) => onChangeItemTable(e, v.code)}
                                                            /> 
                                                        </TableCell>
                                                        <TableCell>KG</TableCell>
                                                        <TableCell>{NumberFormat(v.harga, 'Rp')}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                fullWidth 
                                                                sx={{ width: 300 }}
                                                                label='Quantity'
                                                                type='number'
                                                                name='quantity'
                                                                value={v.quantity}
                                                                onChange={(e) => onChangeItemTable(e, v.code)}
                                                            /> 
                                                        </TableCell>
                                                        <TableCell>{NumberFormat(total, 'Rp')}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                fullWidth 
                                                                sx={{ width: 300 }}
                                                                name='vat'
                                                                label='VAT'
                                                                value={NumberFormat(v.vat, 'Rp')}
                                                                onChange={(e) => onChangeItemTable(e, v.code)}
                                                            /> 
                                                        </TableCell>
                                                        <TableCell>{NumberFormat(grand_total, 'Rp')}</TableCell>
                                                        <TableCell align='center'>
                                                            <Iconify onClick={(e) => deleteItemTable(e, v.code)} icon='material-symbols:delete' sx={{ color: 'red', fontSize: '1rem', cursor: 'pointer' }} />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            
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
                                    submit
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