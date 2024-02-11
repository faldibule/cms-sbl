import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import Iconify from '@components/Iconify'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import TableInputRow from '@components/do-catering/TableInputRow'
import useSaveDOCatering from '@hooks/do-catering/useSaveDOCatering'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Form = (props) => {
    const { data } = props
    const isApproved = useMemo(() => {
        if(!!!data) return false
        return (data?.po_supplier_catering?.status === 'draft' || data?.status === 'submit')
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState(data?.item_product)

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

    const { mutate: save, isLoading: loadingSave, error  } = useSaveDOCatering({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('po_supplier_catering_id', data.po_supplier_catering.id)
        formData.append('hard_edit', 'yes')
        item.forEach((v, i) => {
            const price = parseInt(v?.price) || parseInt(v?.item_price)
            const item_product_id = v.item_product?.id
            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][description]`, v?.description)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][quantity]`, v.quantity)
            formData.append(`item_product[${i}][vat]`, !!v.vat ? v.vat : 11)
            formData.append(`item_product[${i}][remark]`, !!v.remark ? v.remark : '')
        })
        save({ formData, id: data?.id })
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input DO Catering' : 'Form Edit DO Catering' }
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
                            <TextField 
                                disabled
                                label='PO Supplier Catering'
                                name='po_supplier_catering'
                                value={data?.po_supplier_catering?.po_number || 'Loading..'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                disabled
                                label='Supplier'
                                name='supplier'
                                value={data?.po_supplier_catering.supplier.name || 'Loading..'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                disabled
                                label='Location'
                                fullWidth
                                value={data?.pr_catering?.location?.location || 'Loading....'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled
                                fullWidth
                                label="Request Date"
                                value={!!data?.pr_catering?.request_date ? moment(data?.pr_catering?.request_date).format('LL') : 'Loading...'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled
                                fullWidth
                                label="Delivery Date"
                                value={!!data?.pr_catering?.delivery_date ? moment(data?.pr_catering?.delivery_date).format('LL') : 'Loading...'}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField 
                                disabled
                                label='Discount'
                                fullWidth
                                value={`${data?.po_supplier_catering?.discount?.discount}%` || 'Loading....'}
                            />
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
                            <CustomGrandTotalComponent discount={data?.po_supplier_catering?.discount?.discount || 0} item={item} />
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                {isApproved ?
                                    <Button onClick={() => navigate(`/file/${data.id}/do_catering`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
                                        Next
                                    </Button>
                                :
                                    <LoadingButton endIcon={<Iconify icon='carbon:next-filled' />} loading={loadingSave} variant='contained' type='submit'>
                                        Next
                                    </LoadingButton>
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