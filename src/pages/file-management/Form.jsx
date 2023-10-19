import Iconify from '@components/Iconify'
import useDeleteFile from '@hooks/file-management/useDeleteFile'
import useSaveFile from '@hooks/file-management/useSaveFile'
import useShowFile from '@hooks/file-management/useShowFile'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Divider, Grid, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { Fragment, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const loadingButtonStyle = {
    fontSize: '0.7rem', 
    fontWeight: 'bold',
}
const DocumentCardComponent = ({ value, refetch }) => {

    const { mutate: deleteFile, isLoading: loadingDelete } = useDeleteFile({
        onSuccess: () => {
            refetch()
        }
    })
    const handleDeleteFile = (id) => {
        deleteFile(id)
    }

    const { mutate: showFile, isLoading: loadingView } = useShowFile({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `${res.value.original_file_name}`); 
            document.body.appendChild(link);
            link.click();
        }
    })
    const handleViewFile = (value) => {
        showFile(value)
    }

    return (
        <Box sx={{ bgcolor: '#E6EAF8', maxWidth: 250, height: 100, p: 3, borderRadius: 2 }}>
            <Stack direction='row' alignItems='center' spacing={2}>
                <Iconify icon='solar:file-bold-duotone' sx={{ minHeight: 35, minWidth: 35, fontSize: '2rem' }}/>
                <Typography sx={{ maxWidth: 140, wordWrap: 'break-word' }} fontSize='0.7rem' fontWeight='bold'>{value?.original_file_name}</Typography>
            </Stack>
            <Stack direction='row' alignItems='center' justifyContent='end' mt={0.5}>
                <Tooltip title='view'>
                    <LoadingButton sx={{ ...loadingButtonStyle, color: 'blue' }} loading={loadingView} onClick={() => handleViewFile(value)}>
                        Download
                    </LoadingButton>
                </Tooltip>
                <Tooltip title='delete'>
                    <LoadingButton sx={{ ...loadingButtonStyle, color: 'red' }} loading={loadingDelete} onClick={() => handleDeleteFile(value.id)}>
                        Delete
                    </LoadingButton>
                </Tooltip>
            </Stack>
        </Box>
    )
}

const Form = (props) => {
    const { id, reference_type } = useParams()
    const navigate = useNavigate()

    const { mutate: save, isLoading, error } = useSaveFile({
        onSuccess: (res) => {
            props.refetch()
        }
    })

    const handleFile = (e) => {
        if (e.target.files[0] !== undefined) {
            const file = e.target.files[0]
            const formData = new FormData()
            formData.append('reference_type', reference_type)
            formData.append('reference_id', id)
            formData.append('file', file)
            formData.append('type', 'attachment')
            save({ formData })
            e.target.value = null;
         }
    }
    return (
        <Grid container justifyContent='center'>
            <Grid item xs={12} md={8}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Typography variant='h5'>
                                Form Upload Document
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Grid container spacing={2} justifyContent='start'>
                                {props?.data?.map((value, i) => {
                                    return (
                                        <Grid item xs={12} md={4} key={i}>
                                            <DocumentCardComponent refetch={props.refetch} value={value} />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                            <LoadingButton loading={isLoading} sx={{ mt: 4 }} size="large" variant="outlined" component="label" fullWidth startIcon={<Iconify icon='ic:baseline-upload' />}>
                                Add Supporting Document *
                                <input name="document" type="file" onChange={handleFile} hidden />
                            </LoadingButton>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='space-between'>
                                <Button onClick={() => navigate(-1)} startIcon={<Iconify icon='pajamas:go-back' />}>Back</Button>
                                <Button onClick={() => navigate(-2)} variant='contained'>Finish</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Form