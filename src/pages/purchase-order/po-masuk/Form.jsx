import React, { useEffect, useState } from 'react'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Iconify from '@components/Iconify'
import useFetchCustomer from '@hooks/customer/useFetchCustomer'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSavePOMasuk from '@hooks/po-masuk/useSavePOMasuk'
import Loading from '@components/Loading'
import { IntegerFormat, NumberFormat } from '@utils/Format'

const Form = (props) => {
    const { data } = props


    const [customerState, setCustomerState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedCustomer = (value) => setCustomerState({ ...customerState, selected: value })
    const handleInputCustomer = (value) => setCustomerState({ ...customerState, input: value })
    const { data: dataCustomer, isLoading: loadingCustomer } = useFetchCustomer({ paginate: 0 })

    const { mutate: save, isLoading: loadingSave, error } = useSavePOMasuk({
        onSuccess: () => {

        }
    })
    const errors = error?.response?.data?.errors

    const [total, setTotal] = useState('')
    const handleTotal = (v) => setTotal(NumberFormat(v, 'Rp'))

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('customer_id', customerState.selected?.id)
        formData.append('total', IntegerFormat(total))
        save({ formData, id: data?.id })
    }
    
    const [pageLoading, setPageLoading] = useState(props.title === 'add' ? false : true)
    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                setCustomerState({
                    ...customerState,
                    input: `${data.customer.code} - ${data.customer.name}`,
                    selected: data.customer
                })
                handleTotal(data.total)
                setPageLoading(false)
            }
        }

        return () => mounted = false

    }, [props])

    if(pageLoading || loadingCustomer){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        Form PO Masuk
                    </Typography>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                getOptionLabel={(opt) => `${opt.code} - ${opt.name}`}
                                options={dataCustomer.data}
                                label='Customer'
                                inputValue={customerState.input}
                                setInputValue={handleInputCustomer}
                                selectedValue={customerState.selected}
                                setSelectedValue={handleSelectedCustomer}
                                errors={errors?.customer_id}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='PO Number'
                                name='po_number'
                                defaultValue={data?.po_number}
                                required
                                helperText={!!errors?.po_number && errors?.po_number[0]}
                                error={!!errors?.po_number}
                            /> 
                        </Grid> 

                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                label="Tanggal PO Diterima"
                                name='date_received'
                                defaultValue={data?.date_received}
                                required
                                helperText={!!errors?.date_received && errors?.date_received[0]}
                                error={!!errors?.date_received}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
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
                                multiline
                                rows={3}
                                label='Keterangan PO'
                                name='description'
                                defaultValue={data?.description}
                                required
                                helperText={!!errors?.description && errors?.description[0]}
                                error={!!errors?.description}
                            /> 
                        </Grid>
                        
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
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