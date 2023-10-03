import { Avatar, Box, Card, CardContent, Container, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { dataRoleDummy } from '../user-role'
import FormByType from '@components/FormByType'
import { LoadingButton } from '@mui/lab'
import http, { baseURL } from '@variable/Api'
import { useQuery } from 'react-query'
import Loading from '@components/Loading'
import { useNavigate } from 'react-router-dom'
import useCustomSnackbar from '@hooks/useCustomSnackbar'
import useFetchDepartment from '@hooks/department/useFetchDepartment'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useFetchRole from '@hooks/role/useFetchRole'
import useSaveUser from '@hooks/user-list/useSaveUser'

const Form = (props) => {
    const navigate = useNavigate()

    const { data: dataDepartment, isLoading: loadingDepartment } = useFetchDepartment({})
    const { data: dataRole, isLoading: loadingRole } = useFetchRole({})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({})

    const [defaultValue, setDefaultValue] = useState({})
    
    const [image, setImage] = useState({
        image_preview: '',
        image_file: ''
    })
    const handleImage = (e) => {
        let image_preview = URL.createObjectURL(e.target.files[0]);
        let image_file = e.target.files[0];
        setImage({
           image_preview,
           image_file,
        });
    };
    
    const { mutate: save, isLoading: loading, error } = useSaveUser({
        onSuccess: () => {
            if(props.title === 'edit'){
                props.refetch()
            }
            navigate('/user/user-list')
        }
    })
    const errors = error?.response?.data?.errors
    
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        save({
            formData,
            id: props?.id,
            title: props.title
        })
    }
    
    const [pageLoading, setPageLoading] = useState(props.title === 'add' ? false : true)
    useEffect(() => {
        let mounted = true
        if(!!props.data){
            const { data } = props
            if(mounted){
                setTimeout(() => {
                    if(!!data.photo){
                        setImage({
                            image_file: '',
                            image_preview: baseURL + data.photo
                        })
                    }
                    setDefaultValue(data)
                    setPageLoading(false)
                }, 500);
            }
        }
        return () => mounted = false
    }, [props.id])

    if(loadingDepartment || loadingLocation || loadingRole || pageLoading ){
        return <Loading />
    }
    return (
        <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack direction="column" alignItems={"center"}>
                                <input
                                    onChange={handleImage}
                                    type="file"
                                    name="photo"
                                    style={{ display: "none" }}
                                    id="image"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    // required
                                />
                                <Box component="label" htmlFor="image">
                                    <Avatar
                                        sx={{ height: "20vh", width: "20vh", boxShadow: 1, mb: 2, cursor: "pointer" }}
                                        alt="Remy Sharp"
                                        src={image.image_preview !== "" ? image.image_preview : ""}
                                    />
                                </Box>
                                <Typography color="primary" variant="caption">
                                    Allowed *.jpeg, *.jpg, *.png, *.gif,{" "}
                                </Typography>
                                <Typography variant="caption">Max Size 3.1 MB </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Employee Code'
                                    name="code"
                                    defaultValue={defaultValue?.code}
                                    required
                                    helperText={!!errors?.code && errors?.code[0]}
                                    error={!!errors?.code}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Full Name'
                                    name="name"
                                    defaultValue={defaultValue?.name}
                                    required
                                    helperText={!!errors?.name && errors?.name[0]}
                                    error={!!errors?.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Username'
                                    name="username"
                                    defaultValue={defaultValue?.username}
                                    required
                                    helperText={!!errors?.username && errors?.username[0]}
                                    error={!!errors?.username}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Email Address'
                                    name="email"
                                    defaultValue={defaultValue?.email}
                                    required
                                    helperText={!!errors?.username && errors?.username[0]}
                                    error={!!errors?.username}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Phone Number'
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                                    }}
                                    type='number'
                                    name="phone"
                                    defaultValue={defaultValue?.phone}
                                    required
                                    helperText={!!errors?.phone && errors?.phone[0]}
                                    error={!!errors?.phone}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Department'
                                    name="department_id"
                                    defaultValue={defaultValue?.department?.id}
                                    select
                                    required
                                    helperText={!!errors?.department && errors?.department[0]}
                                    error={!!errors?.department}
                                >
                                    {dataDepartment.data.map((v, i) => {
                                        return (
                                            <MenuItem key={v.id} value={v.id}>{v.department_code} - {v.department}</MenuItem>
                                        )
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Role'
                                    name="role"
                                    defaultValue={defaultValue?.role}
                                    select
                                    required
                                    helperText={!!errors?.role && errors?.role[0]}
                                    error={!!errors?.role}
                                >
                                    {dataRole.map((v, i) => {
                                        return (
                                            <MenuItem key={v.name} value={v.name}>{v.name}</MenuItem>
                                        )
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Location'
                                    name="location_id"
                                    defaultValue={defaultValue?.location?.id}
                                    select
                                    required
                                    helperText={!!errors?.location && errors?.location[0]}
                                    error={!!errors?.location}
                                >
                                    {dataLocation.data.map((v, i) => {
                                        return (
                                            <MenuItem key={v.id} value={v.id}>{v.location_code} - {v.location}</MenuItem>
                                        )
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth 
                                    label='Address'
                                    name="address"
                                    defaultValue={defaultValue?.address}
                                    required
                                    multiline
                                    rows={3}
                                    helperText={!!errors?.address && errors?.address[0]}
                                    error={!!errors?.address}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <FormControl required>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Status</FormLabel>
                                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name='status' defaultValue={defaultValue?.status}>
                                        <FormControlLabel value="active" control={<Radio />} label="Active" />
                                        <FormControlLabel value="not_active" control={<Radio />} label="Not Active" />
                                    </RadioGroup>
                                    <FormHelperText error={!!errors?.status}>{!!errors?.status && errors?.status[0]}</FormHelperText>
                                </FormControl>
                            </Grid>
                            {props.title === 'add' ? 
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth 
                                        label='Password'
                                        name="password"
                                        type='password'
                                        defaultValue={defaultValue?.password}
                                        required
                                        helperText={!!errors?.password && errors?.password[0]}
                                        error={!!errors?.password}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth 
                                        label='Password Confirmation'
                                        name="password_confirmation"
                                        type='password'
                                        defaultValue={defaultValue?.password_confirmation}
                                        required
                                        helperText={!!errors?.password && errors?.password[0]}
                                        error={!!errors?.password}
                                    />
                                </Grid>
                            </>
                            : null
                            }
                            <Grid item xs={12} md={12}>
                                <LoadingButton loading={loading} fullWidth variant='contained' type='submit'>
                                    Save
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Form