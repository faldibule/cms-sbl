import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Iconify from '../../../components/Iconify'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '../../../hooks/useCustomSnackbar'
import { NumberFormat } from '../../../utils/Format'
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

const DialogInputRow = ({ open, handleClose, v, onChangeByIndex, i }) => {
    const onSubmit = (e) => {
        e.preventDefault()
        const formElem = document.querySelector('#test') 
        const formData = new FormData(formElem)
        const formObject = Object.fromEntries(formData)
        onChangeByIndex(i, formObject)
        handleClose()
    }
    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={() => {}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>Edit Form {v.name}</DialogTitle>
            <DialogContent>
                <Grid container id='test' component='form' spacing={2} p={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Quantity'
                            type='number'
                            name='quantity'
                            defaultValue={v?.quantity}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            name='vat'
                            type='number'
                            label='VAT'
                            defaultValue={v?.vat}
                        /> 
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Description'
                            name='description'
                            defaultValue={v?.description}
                            multiline
                            rows={3}
                        /> 
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Stack direction='row' justifyContent='end'>
                    <Button color='error' variant="text" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="text" onClick={onSubmit}>
                        Save
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)
    const total = useMemo(() => (v.harga * parseInt(v.vat)) * v.quantity, [v.harga, v.quantity, v.vat])
    const grand_total = useMemo(() => total, [total])
    return (
        <TableRow key={i}>
            <TableCell onClick={handleClose} sx={{ cursor: 'pointer' }}>{i + 1}</TableCell>
            <TableCell>{v.name}</TableCell>
            <TableCell>{v.brand}</TableCell>
            <TableCell>
                {v.description}
            </TableCell>
            <TableCell>KG</TableCell>
            <TableCell>{NumberFormat(v.harga, 'Rp')}</TableCell>
            <TableCell>
                {v.quantity}
            </TableCell>
            <TableCell>{NumberFormat(total, 'Rp')}</TableCell>
            <TableCell>
                {v.vat}
            </TableCell>
            <TableCell>{NumberFormat(grand_total, 'Rp')}</TableCell>
            <TableCell align='center'>
                <Stack direction='row' spacing={2}>
                    <Iconify onClick={handleClose} icon='material-symbols:edit' sx={{ color: 'green', fontSize: '1rem', cursor: 'pointer' }} />
                    <Iconify onClick={(e) => deleteItemTable(e, i)} icon='material-symbols:delete' sx={{ color: 'red', fontSize: '1rem', cursor: 'pointer' }} />
                </Stack>
                <DialogInputRow 
                    handleClose={handleClose} 
                    open={open} 
                    v={v} 
                    onChangeByIndex={onChangeByIndex}
                    i={i}
                />
            </TableCell>
        </TableRow>
    )
}

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
        const dummy = []
        const dataById = itemData.find(v => v.code === e.target.value)
        for(let i = 0; i < 50; i++){
            dummy.push(dataById)
        }
        setItem([...item, ...dummy])
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

    const deleteItemTable = (e, index) => {
        setItem([...item.filter((v, i) => i !== index)])
    }

    const onSubmit = (e) => {
        e.preventDefault()
        sb.success('Success!')
        const formData = new FormData(e.target)
        item.forEach((v, i) => {
            formData.append(`description[${i}]`, v.description)
        })
        console.log(Object.fromEntries(formData))
        // navigate('/purchase-request/input-purchase-request', {
        //     variant: 'success'
        // })
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
                        Form Purchase Request
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
                                label='Location'
                                select
                            >
                                <MenuItem value='1'>Location 1</MenuItem>
                                <MenuItem value='2'>Location 2</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                name='pr_date'
                                label="PR Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
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