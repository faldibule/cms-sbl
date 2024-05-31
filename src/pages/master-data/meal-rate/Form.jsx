import CustomAutocomplete from '@components/CustomAutocomplete'
import Loading from '@components/Loading'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useSaveMealRate from '@hooks/meal-rate/useSaveMealRate'
import { LoadingButton } from '@mui/lab'
import { Box, Card, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { IntegerFormat } from '@utils/Format'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'


const Form = (props) => {
    const { data } = props

    const [locationState, setLocationState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedLocation = (value) => setLocationState({...locationState, selected: value})
    const handleInputLocation = (value) => setLocationState({...locationState, input: value})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({ paginate: 0 })

    // HandleSubmit
    const { mutate: save, isLoading: loadingSave, error } = useSaveMealRate({
        onSuccess: () => {
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const temp = Object.fromEntries(formData)
        for(const item in temp){
            formData.append(item, IntegerFormat(temp[item]))
        }
        formData.append('location_id', locationState.selected?.id)
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                setLocationState({
                    input: `${data.location.location_code} - ${data.location.location}`,
                    selected: data.location
                })
            }
        }

        return () => mounted = false

    }, [props?.id])

    if(loadingLocation){
        return <Loading />
    }
    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input Meal Rate' : 'Form Edit Meal Rate' }
                    </Typography>
                </Grid>
            </Grid>

            <Box>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container component='form' onSubmit={onSubmit} spacing={2}>
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
                            <NumericFormat 
                                label="Manday"
                                fullWidth
                                customInput={TextField} 
                                thousandSeparator="."
                                decimalSeparator=','
                                valueIsNumericString={true}
                                type="tel"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                allowNegative={false}
                                name='manday'
                                defaultValue={data?.manday}
                                helperText={!!errors?.manday && errors?.manday[0]}
                                error={!!errors?.manday}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <NumericFormat 
                                label="Breakfast"
                                fullWidth
                                customInput={TextField} 
                                thousandSeparator="."
                                decimalSeparator=','
                                valueIsNumericString={true}
                                type="tel"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                allowNegative={false}
                                name='breakfast'
                                defaultValue={data?.breakfast}
                                helperText={!!errors?.breakfast && errors?.breakfast[0]}
                                error={!!errors?.breakfast}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <NumericFormat 
                                label="Lunch"
                                fullWidth
                                customInput={TextField} 
                                thousandSeparator="."
                                decimalSeparator=','
                                valueIsNumericString={true}
                                type="tel"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                allowNegative={false}
                                name='lunch'
                                defaultValue={data?.lunch}
                                helperText={!!errors?.lunch && errors?.lunch[0]}
                                error={!!errors?.lunch}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <NumericFormat 
                                label="Dinner"
                                fullWidth
                                customInput={TextField} 
                                thousandSeparator="."
                                decimalSeparator=','
                                valueIsNumericString={true}
                                type="tel"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                allowNegative={false}
                                name='dinner'
                                defaultValue={data?.dinner}
                                helperText={!!errors?.dinner && errors?.dinner[0]}
                                error={!!errors?.dinner}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <NumericFormat 
                                label="Supper"
                                fullWidth
                                customInput={TextField} 
                                thousandSeparator="."
                                decimalSeparator=','
                                valueIsNumericString={true}
                                type="tel"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                allowNegative={false}
                                name='supper'
                                defaultValue={data?.supper}
                                helperText={!!errors?.supper && errors?.supper[0]}
                                error={!!errors?.supper}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <NumericFormat 
                                label="HK"
                                fullWidth
                                customInput={TextField} 
                                thousandSeparator="."
                                decimalSeparator=','
                                valueIsNumericString={true}
                                type="tel"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                allowNegative={false}
                                name='hk'
                                defaultValue={data?.hk}
                                helperText={!!errors?.hk && errors?.hk[0]}
                                error={!!errors?.hk}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                <LoadingButton loading={loadingSave} variant='contained' type='submit'>
                                    Submit
                                </LoadingButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Stack>
    )
}

export default Form