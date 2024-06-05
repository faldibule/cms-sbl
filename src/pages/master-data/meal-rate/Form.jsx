import useSaveMealRate from '@hooks/meal-rate/useSaveMealRate'
import { LoadingButton } from '@mui/lab'
import { Box, Card, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { IntegerFormat } from '@utils/Format'
import { NumericFormat } from 'react-number-format'


const Form = (props) => {
    const { data } = props

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
            if(item === 'name'){
                formData.append(item, temp[item])
            }else{
                formData.append(item, IntegerFormat(temp[item]))
            }
        }
        save({ formData, id: data?.id })
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
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Name'
                                name='name'
                                defaultValue={data?.name}
                                helperText={!!errors?.name && errors?.name[0]}
                                error={!!errors?.name}
                            />  
                        </Grid>
                        <Grid item xs={12} md={6}>
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