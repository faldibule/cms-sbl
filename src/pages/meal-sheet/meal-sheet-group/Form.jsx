import React, { useEffect, useState } from 'react'
import { Box, Button, Card, Checkbox, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Iconify from '@components/Iconify'
import useFetchCustomer from '@hooks/customer/useFetchCustomer'
import CustomAutocomplete from '@components/CustomAutocomplete'
import useSavePOMasuk from '@hooks/po-masuk/useSavePOMasuk'
import Loading from '@components/Loading'
import { IntegerFormat, NumberFormat } from '@utils/Format'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useFetchClient from '@hooks/client/useFetchClient'
import useSaveMealSheetGroup from '@hooks/meal-sheet-group/useSaveMealSheetGroup'

const Form = (props) => {
    const { data } = props

    // Handle Location
    const [locationState, setLocationState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedLocation = (value) => setLocationState({...locationState, selected: value})
    const handleInputLocation = (value) => setLocationState({...locationState, input: value})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({ paginate: 0 })

    // Handle Client
    const [clientState, setClientState] = useState({
        client1: {
            input: '',
            selected: null
        },
        client2: {
            input: '',
            selected: null
        }
    })
    const handleClient = (name, type) => {
        return (value) => {
            setClientState({
                ...clientState,
                [name]: {
                    ...clientState[name],
                    [type]: value
                }
            })
        }
    }
    const { data: dataClient, isLoading: loadingClient } = useFetchClient({ paginate: 0 })

    const { mutate: save, isLoading: loadingSave, error } = useSaveMealSheetGroup({
        onSuccess: () => {

        }
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('location_id', locationState.selected?.id)
        formData.append('client_id[0]', clientState.client1.selected?.id)
        formData.append('client_id[1]', clientState.client2.selected?.id)
        save({ formData, id: data?.id })
    }
    
    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                setLocationState({
                    input: `${data.location.location_code} - ${data.location.location}`,
                    selected: data.location
                })
                setClientState({
                    ...clientState,
                    client1: {
                        input: data?.client[0]?.client_name,
                        selected: data?.client[0],
                    },
                    client2: {
                        input: data?.client[1]?.client_name,
                        selected: data?.client[1],
                    },
                })
            }
        }

        return () => mounted = false

    }, [props])

    if(loadingLocation || loadingClient){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input Meal Sheet Group' : 'Form Edit Meal Sheet Group' }
                    </Typography>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <CustomAutocomplete 
                                options={dataLocation.data}
                                getOptionLabel={(option) => `${option.location_code} - ${option.location}`}
                                label='Location'
                                inputValue={locationState.input}
                                setInputValue={handleInputLocation}
                                selectedValue={locationState.selected}
                                setSelectedValue={handleSelectedLocation}
                                errors={errors?.location_id}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                getOptionLabel={(opt) => `${opt.client_name}`}
                                options={dataClient.data}
                                label='Client 1'
                                inputValue={clientState.client1.input}
                                setInputValue={handleClient('client1', 'input')}
                                selectedValue={clientState.client1.selected}
                                setSelectedValue={handleClient('client1', 'selected')}
                                errors={errors?.client1_id}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                getOptionLabel={(opt) => `${opt.client_name}`}
                                options={dataClient.data}
                                label='Client 2'
                                inputValue={clientState.client2.input}
                                setInputValue={handleClient('client2', 'input')}
                                selectedValue={clientState.client2.selected}
                                setSelectedValue={handleClient('client2', 'selected')}
                                errors={errors?.client2_id}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Prepared Name'
                                name='prepared_by[name]'
                                defaultValue={data?.prepared_by['name']}
                                required
                                helperText={!!errors?.['prepared_by.name'] && errors?.['prepared_by.name'][0]}
                                error={!!errors?.['prepared_by.name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Prepared Position'
                                name='prepared_by[position]'
                                defaultValue={data?.prepared_by['position']}
                                required
                                helperText={!!errors?.['prepared_by.position'] && errors?.['prepared_by.position'][0]}
                                error={!!errors?.['prepared_by.position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Checked Name'
                                name='checked_by[name]'
                                defaultValue={data?.checked_by['name']}
                                required
                                helperText={!!errors?.['checked_by.name'] && errors?.['checked_by.name'][0]}
                                error={!!errors?.['checked_by.name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Checked Position'
                                name='checked_by[position]'
                                defaultValue={data?.checked_by['position']}
                                required
                                helperText={!!errors?.['checked_by.position'] && errors?.['checked_by.position'][0]}
                                error={!!errors?.['checked_by.position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Approved Name'
                                name='approved_by[name]'
                                defaultValue={data?.approved_by['name']}
                                required
                                helperText={!!errors?.['approved_by.name'] && errors?.['approved_by.name'][0]}
                                error={!!errors?.['approved_by.name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Approved Position'
                                name='approved_by[position]'
                                defaultValue={data?.approved_by['position']}
                                required
                                helperText={!!errors?.['approved_by.position'] && errors?.['approved_by.position'][0]}
                                error={!!errors?.['approved_by.position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Acknowladge Name'
                                name='acknowladge_by[name]'
                                defaultValue={data?.acknowladge_by['name']}
                                required
                                helperText={!!errors?.['acknowladge_by.name'] && errors?.['acknowladge_by.name'][0]}
                                error={!!errors?.['acknowladge_by.name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Acknowladge Position'
                                name='acknowladge_by[position]'
                                defaultValue={data?.acknowladge_by['position']}
                                required
                                helperText={!!errors?.['acknowladge_by.position'] && errors?.['acknowladge_by.position'][0]}
                                error={!!errors?.['acknowladge_by.position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={2}>
                                <LoadingButton loading={loadingSave} variant='contained' type='submit'>
                                    Submit
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