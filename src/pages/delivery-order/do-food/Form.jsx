import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Iconify from '../../../components/Iconify'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '../../../hooks/useCustomSnackbar'
import { IntegerFormat, NumberFormat } from '../../../utils/Format'
import CustomGrandTotalComponent from '../../../components/CustomGrandTotalComponent'

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

let itemDataEdit = []
for(let i = 0; i < 4; i++){
    const index = i + 1
    itemDataEdit[i] = {
        code: i + index,
        name: 'item '+ index,
        brand: 'brand '+ index,
        description: 'Test '+ index,
        harga: index * 1000000,
        quantity: 5 + index,
        tax: 11,
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
                if(e.target.name === 'shipment_charge'){
                    return {
                        ...v,
                        [e.target.name]: IntegerFormat(e.target.value)
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
        navigate('/delivery-order/do-food', {
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
                        {props.title === 'add' ? 'Form Input DO Keluar Food Supply' : 'Form Edit DO Keluar Food Supply' }
                    </Typography>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='DO Number'
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='PO Number'
                                select
                                onChange={() => setItem([...itemDataEdit])}
                            >
                                <MenuItem value='1'>PO Number 1</MenuItem>
                                <MenuItem value='2'>PO Number 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='To Customer Name'
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
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth 
                                label='Ship to'
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
                                label='Received By'
                                select
                            >
                                <MenuItem value='1'>User 1</MenuItem>
                                <MenuItem value='2'>User 2</MenuItem>
                            </TextField> 
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
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Current Stock</TableCell>
                                                <TableCell>Tax</TableCell>
                                                <TableCell>Shipment Charge</TableCell>
                                                <TableCell>Total Price</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => {
                                                const temp = v.shipment_charge
                                                const total = (v.harga * v.quantity) + temp
                                                const grand_total = total + (total * 11 / 100) + isNaN(temp) ? 0 : temp
                                                return (
                                                    <TableRow key={i}>
                                                        {/* {props.type === 'approval' ? 
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={v.status}
                                                                    onChange={(e) => onChangeCheckTable(e, v.code)}
                                                                />
                                                            </TableCell>
                                                            : null
                                                        } */}
                                                        <TableCell>{i + 1}</TableCell>
                                                        <TableCell>{v.name}</TableCell>
                                                        <TableCell>{v.brand}</TableCell>
                                                        <TableCell>{v.description}</TableCell>
                                                        <TableCell>{NumberFormat(v.harga, 'Rp')}</TableCell>
                                                        <TableCell>{v.quantity}</TableCell>
                                                        <TableCell>20</TableCell>
                                                        <TableCell>{v.tax}%</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                fullWidth 
                                                                label='Shipment Charge'
                                                                name='shipment_charge'
                                                                value={NumberFormat(v.shipment_charge, 'Rp')}
                                                                onChange={(e) => onChangeItemTable(e, v.code)}
                                                            /> 
                                                        </TableCell>
                                                        <TableCell>{NumberFormat(total, 'Rp')}</TableCell>
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
                            <CustomGrandTotalComponent item={item} />
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