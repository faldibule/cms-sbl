import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '@hooks/useCustomSnackbar'
import { IntegerFormat, NumberFormat } from '@utils/Format'
import Loading from '@components/Loading'
import useFetchSupplier from '@hooks/supplier/useFetchSupplier'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSaveDOMasuk from '@hooks/do-masuk/useSaveDOMasuk'


const Form = (props) => {
    const { data } = props
    const [item, setItem] = useState([])
    const [form, setForm] = useState({
        item: '',
        document: {
            file: '',
            file_name: '',
            file_url: '',
        }
    })

    const [supplierState, setSupplierState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedSupplier = (value) => setSupplierState({...supplierState, selected: value})
    const handleInputSupplier = (value) => setSupplierState({...supplierState, input: value})
    const { data: dataSupplier, isLoading: loadingSupplier } = useFetchSupplier({ paginate: 0 })

    const [total, setTotal] = useState('')
    const handleTotal = (v) => setTotal(NumberFormat(v, 'Rp'))

    const { mutate: save, isLoading: loadingSave, error } = useSaveDOMasuk({
        onSuccess: () => {
        }
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('supplier_id', supplierState.selected?.id)
        formData.append('total', IntegerFormat(total))
        save({ formData, id: data?.id })
    }
    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                setSupplierState({
                    input: data.supplier.name,
                    selected: data.supplier
                })
                handleTotal(data.total)
            }
        }

        return () => mounted = false

    }, [props])
    if(loadingSupplier){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input DO Masuk' : 'Form Edit DO Masuk' }
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
                                name='do_number'
                                defaultValue={data?.do_number}
                                required
                                helperText={!!errors?.do_number && errors?.do_number[0]}
                                error={!!errors?.do_number}
                            /> 
                        </Grid> 
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                options={dataSupplier.data}
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
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                label="Delivery Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                name='delivery_date'
                                defaultValue={data?.delivery_date}
                                required
                                helperText={!!errors?.delivery_date && errors?.delivery_date[0]}
                                error={!!errors?.delivery_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                label="Receieved Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                name='received_date'
                                defaultValue={data?.received_date}
                                required
                                helperText={!!errors?.received_date && errors?.received_date[0]}
                                error={!!errors?.received_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth 
                                label='Total'
                                name='total'
                                value={total}
                                onChange={(e) => handleTotal(e.target.value)}
                                required
                                helperText={!!errors?.total && errors?.total[0]}
                                error={!!errors?.total}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth 
                                label='Keterangan DO'
                                multiline
                                rows={3}
                                name='description'
                                defaultValue={data?.description}
                                required
                                helperText={!!errors?.description && errors?.description[0]}
                                error={!!errors?.description}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={2} justifyContent='end'>
                                <LoadingButton endIcon={<Iconify icon='carbon:next-filled' />} loading={loadingSave} variant='contained' type='submit'>
                                    Next
                                </LoadingButton>
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

        </Stack>
    )
}

export default Form