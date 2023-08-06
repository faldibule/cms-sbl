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
        navigate('/delivery-order/do-keluar', {
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
                        {props.type === 'input' ? 'Form Input Purchase Order' : 'Form Approval Purchase Order' }
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
                                select
                                onChange={() => setItem([...itemDataEdit])}
                            >
                                <MenuItem value='1'>DO Number 1</MenuItem>
                                <MenuItem value='2'>DO Number 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='PO Number'
                                select
                                onChange={() => setItem([...itemDataEdit])}
                            >
                                <MenuItem value='1'>PR Number 1</MenuItem>
                                <MenuItem value='2'>PR Number 2</MenuItem>
                            </TextField> 
                        </Grid>
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
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth 
                                label='Input No'
                            /> 
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth 
                                label='Item Category'
                                select
                            >
                                <MenuItem value='1'>Item Category 1</MenuItem>
                                <MenuItem value='2'>Item Category 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth 
                                label='Brand'
                            /> 
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth 
                                label='Size'
                            /> 
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth 
                                label='Unit Quantity'
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Prepared By'
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Approved By'
                            /> 
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