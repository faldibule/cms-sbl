import ConfirmDialog from '@components/ConfirmDialog'
import CustomAutocomplete from '@components/CustomAutocomplete'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import Iconify from '@components/Iconify'
import ImportModal from '@components/ImportModal'
import Loading from '@components/Loading'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import DeletedTableRow from '@components/po-catering/DeletedTableRow'
import TableInputRow from '@components/po-supplier-catering/TableInputRow'
import useFetchDiscount from '@hooks/discount/useFetchDiscount'
import useFetchPOCatering from '@hooks/po-catering/useFetchPOCatering'
import useFetchPOCateringById from '@hooks/po-catering/useFetchPOCateringById'
import useSavePOSupplierCatering from '@hooks/po-supplier-catering/useSavePOSupplierCatering'
import useFetchSupplier from '@hooks/supplier/useFetchSupplier'
import useIsStoreKeeper from '@hooks/useIsStoreKeeper'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Form = (props) => {
    const { data } = props
    
    const isUserStoreKeeper = useIsStoreKeeper()
    const navigate = useNavigate()
    const [item, setItem] = useState([])
    const [isEdit, setIsEdit] = useState(false)

    const isApproved = useMemo(() => {
        if(!data) return false
        if(!isEdit) return data.status === 'submit'
        return !isEdit
    }, [data, isEdit])

    const [modalConfirmEdit, setModalConfirmEdit] = useState(false)
    const handleEditButton = () => {
        if(!isEdit){
            setModalConfirmEdit(true)
            return
        }
        setIsEdit(false)
    }
    const handleClickModalEdit = () => {
        setModalConfirmEdit(false)
        setIsEdit(true)
    }

    // PO Catering Handle
    const [poCateringState, setPOCateringState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedPOCatering = (value) => setPOCateringState({...poCateringState, selected: value})
    const handleInputPOCatering = (value) => setPOCateringState({...poCateringState, input: value})
    const { data: dataPOCateringList, isLoading: loadingPOCateringList } = useFetchPOCatering({ paginate: 0, status: ['finish'] })
    const { data: dataPOCateringById, isLoading: loadingPOCateringById } = useFetchPOCateringById(poCateringState.selected?.id, { enabled: !!poCateringState.selected?.id })

    // Handle Supplier
    const [supplierState, setSupplierState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedSupplier = (value) => setSupplierState({...supplierState, selected: value})
    const handleInputSupplier = (value) => setSupplierState({...supplierState, input: value})
    const { data: dataSupplier, isLoading: loadingSupplier } = useFetchSupplier({ paginate: 0, po_catering_id: poCateringState.selected?.id }, { enabled: !!poCateringState.selected?.id })

    useEffect(() => {
        let mounted = true
        if(!poCateringState.selected?.id) return
        if(!supplierState.selected?.id) return
        if(!dataPOCateringById) return
        if(!mounted) return 

        if(props.title === 'edit' && (poCateringState.selected?.id === data.po_catering?.id) && supplierState.selected?.id === data.supplier?.id){
            setItem([...data.item_product])
            return
        }
        
        setItem([...dataPOCateringById?.item_product.filter((v, i) => v.item_product.supplier.id === supplierState.selected?.id)])

        return () => mounted = false

    }, [poCateringState.selected, supplierState.selected, dataPOCateringById, data])

    // Discount Handle
    const { data: dataDiscount, isLoading: loadingDiscount } = useFetchDiscount({ paginate: 0 })
    const [discount, setDiscount] = useState({
        id: '',
        value: 0
    })
    const handleDiscount = (id) => {
        const discountById = dataDiscount?.data?.find(v => v.id === id)
        setDiscount({
            id: discountById.id,
            value: discountById.discount
        })
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

    const getProductIdList = useMemo(() => {
        if(!dataPOCateringById) return {}
        if(!supplierState.selected?.id) return {}

       const dataPOCateringByIdFilteredBySupplier = dataPOCateringById.item_product.filter(v => v.item_product?.supplier?.id === supplierState.selected?.id)
       const itemFilteredBySupplier = item.filter(v => v.item_product?.supplier?.id === supplierState.selected?.id)
       return {
            dataPOCateringByIdFilteredBySupplier,
            itemFilteredBySupplier
       }

    }, [dataPOCateringById, supplierState.selected, item])

    // Get product that exist in PR but not exist in PO
    const differenceProductPRtoPO = useMemo(() => {
        if(!dataPOCateringById) return []
        if(!supplierState.selected?.id) return []

        const tempIdProductPOCatering = getProductIdList?.itemFilteredBySupplier.map(v => v.item_product.id)
        return getProductIdList.dataPOCateringByIdFilteredBySupplier.filter(v => !tempIdProductPOCatering.includes(v.item_product.id))
    }, [getProductIdList])

    // Get product that exist in PO but not exist in PR (deleted)
    const differenceProductPOtoPR = useMemo(() => {
        if(!dataPOCateringById) return []
        if(!supplierState.selected?.id) return []

        // get all product id from PR
        const tempIdProductPOCatering = getProductIdList.dataPOCateringByIdFilteredBySupplier.map(v => v.item_product.id)

        return getProductIdList.itemFilteredBySupplier.filter(v => !tempIdProductPOCatering.includes(v.item_product.id))
    }, [getProductIdList])

    const itemFiltered = useMemo(() => {
        if(!data) return item
        if(!dataPOCateringById) return []
        if(!supplierState.selected?.id) return []

        // get all product id from PR
        const tempIdProductPOCatering = getProductIdList.dataPOCateringByIdFilteredBySupplier.map(v => v.item_product.id)

        return [...getProductIdList.itemFilteredBySupplier.filter(v => tempIdProductPOCatering.includes(v.item_product.id)), ...differenceProductPRtoPO]
    }, [getProductIdList])
    
    // Handle Import
    const [modalImport, setModalImport] = useState(false)
    const handleModalImport = () => setModalImport(!modalImport)
    const onSuccessImport = (data) => {
        setItem(data.data)
    }

    const { mutate: save, isLoading: loadingSave, error  } = useSavePOSupplierCatering({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('po_catering_id', poCateringState.selected?.id)
        formData.append('supplier_id', supplierState.selected?.id)
        formData.append('checked_by', dataPOCateringById.checked_by?.id)
        formData.append('approved1_by', dataPOCateringById.approved1_by?.id)
        formData.append('approved2_by', dataPOCateringById.approved2_by?.id)
        formData.append('hard_edit', 'yes')
        itemFiltered.forEach((v, i) => {
            const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price)
            const item_product_id = v?.item_product?.id || v?.id

            formData.append(`item_product[${i}][item_product_id]`, item_product_id)
            formData.append(`item_product[${i}][description]`, v?.description)
            formData.append(`item_product[${i}][item_price]`, price)
            formData.append(`item_product[${i}][quantity]`, v.quantity)
            formData.append(`item_product[${i}][vat]`, !!v.vat ? v.vat : 11)
            formData.append(`item_product[${i}][remark]`, !!v.remark ? v.remark : '')
        })
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                setPOCateringState({
                    input: data.po_catering.po_number,
                    selected: data.po_catering
                })
                setSupplierState({
                    input: data.supplier.name,
                    selected: data.supplier
                })
                setDiscount({
                    id: data?.discount?.id,
                    value: data?.discount?.discount
                })
                
                setItem([...data.item_product])
            }
        }

        return () => mounted = false

    }, [props])

    const renderDiscountMenuItem = useCallback(() => {
        if(loadingDiscount) return null
        if(dataDiscount.data.length === 0 ){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return dataDiscount.data.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.discount}%</MenuItem>
            )
        })

    }, [dataDiscount])

    if(loadingDiscount || loadingPOCateringList){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between'>
                        <Stack>
                            <Typography variant='h5'>
                                {props.title === 'add' ? 'Form Input PO Supplier Catering' : 'Form Edit PO Supplier Catering' }
                            </Typography>
                            {!!data ? 
                                <Typography fontStyle='italic' variant='body2' fontWeight='bold'>
                                    {data?.po_number}
                                </Typography>
                            : null}
                        </Stack>
                        {!!data && data?.status === 'submit' && isUserStoreKeeper ?
                            <Button onClick={() => handleEditButton()} variant='contained' color='primary' sx={{ height: '5dvh', mt: { xs: 2, md: 0 } }}>
                                {isEdit ? 'Cancel Edit' : 'Edit Data PO Supplier Catering'}
                            </Button>
                        : null
                        }
                    </Stack>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                disabled={isApproved}
                                options={dataPOCateringList?.data || []}
                                getOptionLabel={(option) => `${option.po_number}`}
                                label='PO Catering Number'
                                inputValue={poCateringState.input}
                                setInputValue={handleInputPOCatering}
                                selectedValue={poCateringState.selected}
                                setSelectedValue={handleSelectedPOCatering}
                                errors={errors?.po_catering_id}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                disabled={isApproved || !dataSupplier?.data || loadingSupplier}
                                options={dataSupplier?.data || []}
                                getOptionLabel={(option) => `${option.name}`}
                                label='Supplier'
                                inputValue={supplierState.input}
                                setInputValue={handleInputSupplier}
                                selectedValue={supplierState.selected}
                                setSelectedValue={handleSelectedSupplier}
                                errors={errors?.supplier_id}
                                key='supplier'
                            /> 
                        </Grid>
                        {!!poCateringState.selected?.id && !!supplierState?.selected?.id ? 
                        <>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Attention Name"
                                    value={supplierState?.selected?.contact_person}
                                /> 
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Request Date"
                                    value={!!dataPOCateringById?.pr_catering?.request_date ? moment(dataPOCateringById?.pr_catering?.request_date).format('LL') : 'Loading...'}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Delivery Date"
                                    value={!!dataPOCateringById?.pr_catering?.delivery_date ? moment(dataPOCateringById?.pr_catering?.delivery_date).format('LL') : 'Loading...'}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField 
                                    label='Location'
                                    fullWidth
                                    disabled
                                    value={dataPOCateringById?.pr_catering?.location?.location || 'Loading....'}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    disabled={isApproved}
                                    fullWidth
                                    label='Discount'
                                    name='discount_id'
                                    value={discount.id}
                                    onChange={(e) => handleDiscount(e.target.value)}
                                    required
                                    helperText={!!errors?.discount_id && errors?.discount_id[0]}
                                    error={!!errors?.discount_id}
                                    select
                                >
                                    {renderDiscountMenuItem()}
                                </TextField> 
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    disabled={isApproved}       
                                    fullWidth 
                                    label='Terms & Condition'
                                    multiline
                                    rows={3}
                                    name='term_condition'
                                    required
                                    defaultValue={data?.term_condition}
                                    helperText={!!errors?.term_condition && errors?.term_condition[0]}
                                    error={!!errors?.term_condition}
                                /> 
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    disabled={isApproved}       
                                    fullWidth 
                                    label='Status'
                                    name='status'
                                    required
                                    defaultValue={data?.status}
                                    helperText={!!errors?.status && errors?.status[0]}
                                    error={!!errors?.status}
                                    select
                                >
                                    <MenuItem value='draft'>Draft</MenuItem>
                                    <MenuItem value='submit'>Submit</MenuItem>
                                </TextField> 
                            </Grid>
                            {(!!data && differenceProductPOtoPR.length > 0) ?
                                <Grid item xs={12} md={12}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', my: 2 }}>Deleted Item Product</Typography>
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
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>No.</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Item Name</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Item Brand</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Description</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Size</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Unit</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Quantity</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>VAT</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Total Tax</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Total Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Grand Total</TableCellHeaderColor>
                                                    <TableCellHeaderColor bgcolor='#ffd3d3'>Remarks</TableCellHeaderColor>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {differenceProductPOtoPR.map((v, i) => <DeletedTableRow isApproved={true} errors={errors} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} /> )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                : null
                            }
                            <Grid item xs={12} md={12}>
                                {itemFiltered.length > 0 ? 
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
                                                    <TableCellHeaderColor>Size</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Unit</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Quantity</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Unit Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Tax</TableCellHeaderColor>
                                                    <TableCellHeaderColor>VAT</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Total Price</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Grand Total</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Remark</TableCellHeaderColor>
                                                    <TableCellHeaderColor>Action</TableCellHeaderColor>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {itemFiltered.map((v, i) => <TableInputRow isApproved={isApproved} errors={errors} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} /> )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                : 
                                null
                                }
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <CustomGrandTotalComponent discount={discount.value} item={itemFiltered} />
                            </Grid> 
                            <Grid item xs={12} md={12}>
                                <Stack direction='row' justifyContent='end' spacing={2}>
                                    {isApproved ?
                                        <Button onClick={() => navigate(`/file/${data?.id}/po_supplier_catering`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
                                            Next
                                        </Button>
                                    :
                                        <LoadingButton disabled={item.length === 0} endIcon={<Iconify icon='carbon:next-filled' />} loading={loadingSave} variant='contained' type='submit'>
                                            Next
                                        </LoadingButton>
                                    }
                                </Stack>
                            </Grid>
                        </>
                        : null
                        }
                    </Grid>
                </Card>
            </Box>
            <ConfirmDialog 
                handleClick={handleClickModalEdit}
                title='Edit'
                handleClose={() => setModalConfirmEdit(false)}
                open={modalConfirmEdit}
            />
            <ImportModal 
                handleClose={handleModalImport}
                open={modalImport}
                title='Product PO Keluar Quotation'
                url={'read-excel/product-price'}
                onSuccessImport={onSuccessImport}
            />
        </Stack>
    )
}

export default Form