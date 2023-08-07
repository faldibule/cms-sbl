import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Iconify from '../../../components/Iconify'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '../../../hooks/useCustomSnackbar'
import { NumberFormat } from '../../../utils/Format'

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
        status: false,
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
        status: true,
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
        status: false,
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
        status: false,
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
        status: false,
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
        status: false,
    }
]

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

    const deleteItemTable = (e, id) => {
        setItem([...item.filter(v => v.code !== id)])
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
        navigate('/purchase-request/input-purchase-request', {
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
                        Form Approval Purchase Request
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
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Customer Name'
                                select
                            >
                                <MenuItem value='1'>Customer 1</MenuItem>
                                <MenuItem value='2'>Customer 2</MenuItem>
                            </TextField> 
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
                                label='User Maker'
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Notes'
                            /> 
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
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                    bgcolor: '#d6e9ff'
                                                }}
                                            >
                                                <TableCell></TableCell>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Item Name</TableCell>
                                                <TableCell>Item Brand</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Harga</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Current Stock</TableCell>
                                                <TableCell>Tax</TableCell>
                                                <TableCell>Total</TableCell>
                                                <TableCell>Total Price</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => {
                                                const total = v.harga * v.quantity
                                                const grand_total = total + (total * 11 / 100)
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={v.status}
                                                                onChange={(e) => onChangeCheckTable(e, v.code)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{i + 1}</TableCell>
                                                        <TableCell>{v.name}</TableCell>
                                                        <TableCell>{v.brand}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                fullWidth 
                                                                label='Description'
                                                                name='description'
                                                                value={v.description}
                                                                onChange={(e) => onChangeItemTable(e, v.code)}
                                                            /> 
                                                        </TableCell>
                                                        <TableCell>{NumberFormat(v.harga, 'Rp')}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                fullWidth 
                                                                label='Quantity'
                                                                type='number'
                                                                name='quantity'
                                                                value={v.quantity}
                                                                onChange={(e) => onChangeItemTable(e, v.code)}
                                                            /> 
                                                        </TableCell>
                                                        <TableCell>10</TableCell>
                                                        <TableCell>{v.tax}%</TableCell>
                                                        <TableCell>{NumberFormat(total, 'Rp')}</TableCell>
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
                            <LoadingButton variant='contained' type='submit' sx={{ ml: 'auto' }}>
                                submit
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Card>
            </Box>

        </Stack>
    )
}

export default Form