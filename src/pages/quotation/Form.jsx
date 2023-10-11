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

const itemData = [
    {
        code: '1',
        name: 'item 1',
        weight: '1',
        unit: 'kg',
        harga: 1000000,
        quantity: 0,
        vat: 0,
        tnt: '',
        remarks: ''
    },
]

const itemDataEdit = [
    {
        code: '1',
        name: 'item 1',
        weight: '1',
        unit: 'kg',
        harga: 1000000,
        quantity: 0,
        vat: 0,
        tnt: '',
        remarks: ''
    },
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
                            <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                                <TextField
                                    size='small'
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
                                <LoadingButton loading={importLoading} component='label' sx={{ width: 120 }} variant='contained' startIcon={<Iconify icon='material-symbols:upload-rounded' />}>
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