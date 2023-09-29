import { Avatar, Box, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { dataRoleDummy } from '../user-role'
import FormByType from '@components/FormByType'
import { LoadingButton } from '@mui/lab'

const Form = (props) => {
    const { data: defaultValue } = props

    const [dataDepartment, setDataDepartment] = useState([ { id: '1', label: 'Department 1' }, { id: '2', label: 'Department 2' } ])
    const [dataRole, setDataRole] = useState(dataRoleDummy)
    const [dataLocation, setDataLocation] = useState([  { id: '1', label: 'Location 1' }, { id: '2', label: 'Location 2' }  ])
    
    const [form, setForm] = useState([
        {
            name: 'employee_code',
            label: 'Employee Code',
            type: 'text-uncontrolled',
            typeInput: 'text',
            defaultValue: defaultValue?.employee_code
        },
        {
            name: 'full_name',
            label: 'Full Name',
            type: 'text-uncontrolled',
            typeInput: 'text',
            defaultValue: defaultValue?.full_name
        },
        {
            name: 'email',
            label: 'Email Address',
            type: 'text-uncontrolled',
            typeInput: 'email',
            defaultValue: defaultValue?.email
        },
        {
            name: 'phone_number',
            label: 'Phone Number',
            type: 'text-uncontrolled',
            typeInput: 'number',
            defaultValue: defaultValue?.phone_number
        },
        {
            name: 'department',
            label: 'Department',
            type: 'select-uncontrolled',
            typeInput: 'text',
            defaultValue: defaultValue?.department,
            data: dataDepartment,
        },
        {
            name: 'role',
            label: 'Role',
            type: 'select-uncontrolled',
            typeInput: 'text',
            defaultValue: defaultValue?.role,
            data: dataRole,
        },
        {
            name: 'location',
            label: 'Location',
            type: 'select-uncontrolled',
            typeInput: 'text',
            defaultValue: defaultValue?.location,
            data: dataLocation,
        },
        {
            name: 'address',
            label: 'Address',
            type: 'textarea-uncontrolled',
            typeInput: 'text',
            defaultValue: defaultValue?.address,
        },
        {
            name: 'password',
            label: 'Password',
            type: 'text-uncontrolled',
            typeInput: 'password',
            defaultValue: '',
        },
        {
            name: 're-password',
            label: 'Repeat Password',
            type: 'text-uncontrolled',
            typeInput: 'password',
            defaultValue: '',
        },
        {
            name: 'status',
            label: 'Status User',
            type: 'radio-uncontrolled',
            typeInput: 'radio',
            defaultValue: defaultValue?.status,
        },
    ])
    
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

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        console.log(Object.fromEntries(formData))
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
                                    name="image"
                                    style={{ display: "none" }}
                                    id="image"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    // required
                                />
                                <Box component="label" htmlFor="image">
                                    <Avatar
                                        sx={{ height: "20vh", width: "20vh", boxShadow: 1, mb: 2, cursor: "pointer" }}
                                        alt="Remy Sharp"
                                        src={image.image_preview !== "" ? image.image_preview : "/assets/images.default.png"}
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
                            {form.map((v, i) => {
                                const md = v.name === 'location' || v.name === 'address' ? 12 : 6
                                
                                return (
                                    <Grid item xs={12} md={md} key={v.name}>
                                        <FormByType v={v} />
                                    </Grid>
                                )
                            })}
                            <Grid item xs={12} md={12}>
                                <LoadingButton fullWidth variant='contained' type='submit'>
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