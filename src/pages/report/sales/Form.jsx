import CustomAutocomplete from '@components/CustomAutocomplete'
import Loading from '@components/Loading'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useFetchMealRate from '@hooks/meal-rate/useFetchMealRate'
import useSaveSales from '@hooks/sales/useSaveSales'
import { LoadingButton } from '@mui/lab'
import { Box, Card, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { IntegerFormat } from '@utils/Format'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'

const dataMonth = [
    { month: 'Januari', value: 1 },
    { month: 'Februari', value: 2 },
    { month: 'Maret', value: 3 },
    { month: 'April', value: 4 },
    { month: 'Mei', value: 5 },
    { month: 'Juni', value: 6 },
    { month: 'Juli', value: 7 },
    { month: 'Agustus', value: 8 },
    { month: 'September', value: 9 },
    { month: 'Oktober', value: 10 },
    { month: 'November', value: 11 },
    { month: 'Desember', value: 12 },
];

const getYearList = () => {
    const currentYear = new Date().getFullYear();
    const yearsBefore = [currentYear - 3, currentYear - 2, currentYear - 1];
    const yearsAfter = [currentYear + 1, currentYear + 2, currentYear + 3];
    const yearList = [...yearsBefore, currentYear, ...yearsAfter];

    return yearList;
};

const MealRateForm = ({ data, errors }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                <TextField
                    fullWidth 
                    label='Minimum'
                    name='minimum'
                    defaultValue={data?.minimum}
                    helperText={!!errors?.minimum && errors?.minimum[0]}
                    error={!!errors?.minimum}
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
        </Grid>
    )
}

const Form = (props) => {
    const { data } = props

    const [tempMealRate, setTempMealRate] = useState()
    
    const [locationState, setLocationState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedLocation = (value) => setLocationState({...locationState, selected: value})
    const handleInputLocation = (value) => setLocationState({...locationState, input: value})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({ paginate: 0 })

    const [mealRateState, setMealRateState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedMealRate = (value) => setMealRateState({...mealRateState, selected: value})
    const handleInputMealRate = (value) => setMealRateState({...mealRateState, input: value})
    const { data: dataMealRate, isLoading: loadingMealRate } = useFetchMealRate({ paginate: 0 })

    const { mutate: save, isLoading: loadingSave, error } = useSaveSales({
        onSuccess: () => {
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const temp = Object.fromEntries(formData)
        for(const item in temp){
            if(item === 'year' || item === 'month'){
                formData.append(item, temp[item])
            }else{
                formData.append(item, IntegerFormat(temp[item]))
            }
        }
        formData.append('location_id', locationState.selected?.id)
        setTempMealRate({ ...Object.fromEntries(formData) })
        save({ formData })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                setLocationState({
                    input: `${data.location.location_code} - ${data.location.location}`,
                    selected: data.location
                })
                setTempMealRate({ ...data })
            }
        }

        return () => mounted = false

    }, [props?.id])
    
    if(loadingLocation || loadingMealRate) return <Loading />
    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input Sales Report' : 'Form Edit Sales Report' }
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
                            <TextField
                                fullWidth 
                                label='Month'
                                name='month'
                                defaultValue={data?.month || ''}
                                required
                                helperText={!!errors?.month && errors?.month[0]}
                                error={!!errors?.month || !!errors?.month}
                                select
                            >
                                {dataMonth.map((v, i) => {
                                    return (
                                        <MenuItem key={v.value} value={v.value}>{v.month}</MenuItem>
                                    )
                                })}
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Year'
                                name='year'
                                defaultValue={data?.year || ''}
                                required
                                helperText={!!errors?.year && errors?.year[0]}
                                error={!!errors?.year || !!errors?.year}
                                select
                            >
                                {getYearList().map((v, i) => {
                                    return (
                                        <MenuItem key={v} value={v}>{v}</MenuItem>
                                    )
                                })}
                            </TextField> 
                        </Grid>
                        {!data ?
                            <Grid item xs={12} md={12}>
                                <CustomAutocomplete 
                                    required={false}
                                    options={dataMealRate.data}
                                    getOptionLabel={(option) => `${option.name}`}
                                    label='Meal Rate'
                                    inputValue={mealRateState.input}
                                    setInputValue={handleInputMealRate}
                                    selectedValue={mealRateState.selected}
                                    setSelectedValue={handleSelectedMealRate}
                                />
                            </Grid>
                        : null
                        }
                        <Grid item xs={12}>
                            {!!mealRateState.selected?.id || !!tempMealRate ?
                                <MealRateForm key={Math.random(10)} data={mealRateState.selected || tempMealRate} errors={{}} />
                            : null
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                <LoadingButton disabled={!locationState.selected?.id || (!tempMealRate && !mealRateState.selected?.id)} loading={loadingSave} variant='contained' type='submit'>
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