import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate } from 'react-router-dom'
import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import TableInputRow from '@components/meal-sheet-detail/TableInputRow'
import { read, utils } from 'xlsx'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import useFetchCustomer from '@hooks/customer/useFetchCustomer'
import useFetchUser from '@hooks/user-list/useFetchUser'
import Loading from '@components/Loading'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSaveQuotation from '@hooks/quotation/useSaveQuotation'
import ImportModal from '@components/ImportModal'
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct'
import DialogInputRow from '@components/meal-sheet-detail/DialogInputRow'

const Form = (props) => {
    const { data } = props
    const isApproved = useMemo(() => {
        if(!!!data) return false
        return data.status === 'finish'
    }, [data])

    const navigate = useNavigate()
    const [item, setItem] = useState([])

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
        approved1_by: {
            input: '',
            selected: null
        },
        approved2_by: {
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
    const { data: dataItemProduct, isLoading: loadingItemProduct } = useFetchItemProduct({ paginate: 0 })

    // Handle Import
    const [modalImport, setModalImport] = useState(false)
    const handleModalImport = () => setModalImport(!modalImport)
    const onSuccessImport = (data) => {
        setItem(data.data)
    }

    // Handle Modal Input
    const [modalInput, setModalInput] = useState(false)
    const handleModalInput = () => setModalInput(!modalInput)

    const deleteItemTable = (e, index) => {
        setItem([...item.filter((v, i) => i !== index)])
    }

    const onChangeByIndex = (index, object) => {
        let temp = []
        if(index !== undefined){
            temp = item.map((v, i) => {
                if(i === index){
                    return {
                        ...object
                    }
                }
                return v
            })
            setItem([...temp])
            return;
        }
        setItem([...item, object])
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveQuotation({
        onSuccess: () => {}
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                
            }
        }

        return () => mounted = false

    }, [props?.id])

    if(loadingCustomer || loadingUser || loadingItemProduct){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input Meal Sheet Detail' : 'Form Edit Meal Sheet Detail' }
                    </Typography>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth 
                                label='Client'
                                name='client'
                                defaultValue={data?.client}
                                required
                                helperText={!!errors?.client && errors?.client[0]}
                                error={!!errors?.client}
                                select
                            > 
                                <MenuItem value='1'>PHE OSES</MenuItem>
                                <MenuItem value='2'>Andromeda</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Mandays'
                                name='mandays'
                                defaultValue={data?.mandays}
                                required
                                helperText={!!errors?.mandays && errors?.mandays[0]}
                                error={!!errors?.mandays}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Casual Break Fast'
                                name='casual_b'
                                defaultValue={data?.casual_b}
                                required
                                helperText={!!errors?.casual_b && errors?.casual_b[0]}
                                error={!!errors?.casual_b}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Casual Lunch'
                                name='casual_l'
                                defaultValue={data?.casual_l}
                                required
                                helperText={!!errors?.casual_l && errors?.casual_l[0]}
                                error={!!errors?.casual_l}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Casual Dinner'
                                name='casual_d'
                                defaultValue={data?.casual_d}
                                required
                                helperText={!!errors?.casual_d && errors?.casual_d[0]}
                                error={!!errors?.casual_d}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Prepared Name'
                                name='prepared_by[name]'
                                defaultValue={data?.prepared_by['name']}
                                required
                                helperText={!!errors?.prepared_by['name'] && errors?.prepared_by['name'][0]}
                                error={!!errors?.prepared_by['name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Prepared Position'
                                name='prepared_by[position]'
                                defaultValue={data?.prepared_by['position']}
                                required
                                helperText={!!errors?.prepared_by['position'] && errors?.prepared_by['position'][0]}
                                error={!!errors?.prepared_by['position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Checked Name'
                                name='checked_by[name]'
                                defaultValue={data?.checked_by['name']}
                                required
                                helperText={!!errors?.checked_by['name'] && errors?.checked_by['name'][0]}
                                error={!!errors?.checked_by['name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Checked Position'
                                name='checked_by[position]'
                                defaultValue={data?.checked_by['position']}
                                required
                                helperText={!!errors?.checked_by['position'] && errors?.checked_by['position'][0]}
                                error={!!errors?.checked_by['position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Approved Name'
                                name='approved_by[name]'
                                defaultValue={data?.approved_by['name']}
                                required
                                helperText={!!errors?.approved_by['name'] && errors?.approved_by['name'][0]}
                                error={!!errors?.approved_by['name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Approved Position'
                                name='approved_by[position]'
                                defaultValue={data?.approved_by['position']}
                                required
                                helperText={!!errors?.approved_by['position'] && errors?.approved_by['position'][0]}
                                error={!!errors?.approved_by['position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={1} justifyContent={{ xs: 'space-between', md: 'start' }}>
                                <Button onClick={handleModalInput} fullWidth sx={{ width: { xs: '100%', md: 150 } }} variant='outlined' startIcon={<Iconify icon='ic:baseline-plus' />}>
                                    Add Data
                                </Button>
                                <Button onClick={handleModalImport} fullWidth sx={{ width: { xs: '100%', md: 150 } }} variant='contained' startIcon={<Iconify icon='material-symbols:upload-rounded' />}>
                                    Import
                                </Button>
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
                                                <TableCellHeaderColor>Name</TableCellHeaderColor>
                                                <TableCellHeaderColor>Position</TableCellHeaderColor>
                                                <TableCellHeaderColor>Breakfast</TableCellHeaderColor>
                                                <TableCellHeaderColor>Lunch</TableCellHeaderColor>
                                                <TableCellHeaderColor>Dinner</TableCellHeaderColor>
                                                <TableCellHeaderColor>Super</TableCellHeaderColor>
                                                <TableCellHeaderColor>Casual</TableCellHeaderColor>
                                                <TableCellHeaderColor>Accomodation</TableCellHeaderColor>
                                                <TableCellHeaderColor>Total</TableCellHeaderColor>
                                                <TableCellHeaderColor>Action</TableCellHeaderColor>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => <TableInputRow isApproved={isApproved} key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} errors={errors} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            : 
                            null
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                {isApproved ?
                                    <Button onClick={() => navigate(`/file/${data?.id}/purchase_request`)} variant='contained' startIcon={<Iconify icon='carbon:next-filled'  />}>
                                        Next
                                    </Button>
                                :
                                    <LoadingButton endIcon={<Iconify icon='carbon:next-filled' />} loading={loadingSave} variant='contained' type='submit'>
                                        Next
                                    </LoadingButton>
                                }
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
            <ImportModal 
                handleClose={handleModalImport}
                open={modalImport}
                title='Meal Sheet Detail'
                url={'read-excel/product-price'}
                onSuccessImport={onSuccessImport}
            />
            <DialogInputRow 
                handleClose={handleModalInput} 
                open={modalInput} 
                onChangeByIndex={onChangeByIndex}
            />
        </Stack>
    )
}

export default Form