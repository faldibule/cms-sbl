import Loading from '@components/Loading'
import useFetchDepartment from '@hooks/department/useFetchDepartment'
import useShowFile from '@hooks/file-management/useShowFile'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useFetchRole from '@hooks/role/useFetchRole'
import useSaveUser from '@hooks/user-list/useSaveUser'
import { LoadingButton } from '@mui/lab'
import { Avatar, Box, Card, CardContent, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { authentication } from '@recoil/Authentication'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

const Form = (props) => {
    const navigate = useNavigate()
    const { data } = props

    const [{ user }, setAuth] = useRecoilState(authentication)

    const { data: dataDepartment, isLoading: loadingDepartment } = useFetchDepartment({})
    const { data: dataRole, isLoading: loadingRole } = useFetchRole({})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({})

    const profile_user_by_id = localStorage.getItem('profile_user_by_id')

    const [image, setImage] = useState({
        image_preview: !!data?.photo ? profile_user_by_id : '',
        image_file: ''
    }) 
    const handleImage = (e) => {
        if(!!e.target.files[0]){
            let image_preview = URL.createObjectURL(e.target.files[0]);
            let image_file = e.target.files[0];
            setImage({
               image_preview,
               image_file,
            });
        }
    };
    
    const { mutate: getProfilePicture } = useShowFile({
        onSuccess: (res) => {
            const reader = new FileReader();
            reader.onload = function () {
              const dataURL = reader.result;
              localStorage.setItem("profile_picture", dataURL);
              setAuth({
                    user,
                    auth: true,
                    profile_picture: dataURL
              });
              navigate('/user/user-list')
            };
            reader.readAsDataURL(res.data);
        }
    })
    const { mutate: save, isLoading: loading, error } = useSaveUser({
        onSuccess: (res) => {
            const { response } = res
            if(props.title === 'edit'){
                if(res.form.photo.size !== 0 && response.data.id === user.id){
                    getProfilePicture({ file: response.data.photo })
                    return;
                }
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
    
    if(loadingDepartment || loadingLocation || loadingRole){
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
                                    defaultValue={data?.code}
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
                                    defaultValue={data?.name}
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
                                    defaultValue={data?.username}
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
                                    defaultValue={data?.email}
                                    required
                                    helperText={!!errors?.username && errors?.username[0]}
                                    error={!!errors?.username}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Phone Number'
                                    type='number'
                                    name="phone"
                                    defaultValue={data?.phone}
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
                                    defaultValue={data?.department?.id}
                                    select
                                    required
                                    helperText={!!errors?.department && errors?.department[0]}
                                    error={!!errors?.department}
                                >
                                    {dataDepartment?.data.map((v, i) => {
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
                                    defaultValue={data?.role}
                                    select
                                    required
                                    helperText={!!errors?.role && errors?.role[0]}
                                    error={!!errors?.role}
                                >
                                    {dataRole?.map((v, i) => {
                                        return (
                                            <MenuItem key={v.name} value={v.name}>{v.name.replaceAll('-', ' ')}</MenuItem>
                                        )
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth 
                                    label='Location'
                                    name="location_id"
                                    defaultValue={data?.location?.id}
                                    select
                                    required
                                    helperText={!!errors?.location && errors?.location[0]}
                                    error={!!errors?.location}
                                >
                                    {dataLocation?.data.map((v, i) => {
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
                                    defaultValue={data?.address}
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
                                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name='status' defaultValue={data?.status}>
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
                                        defaultValue={data?.password}
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
                                        defaultValue={data?.password_confirmation}
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