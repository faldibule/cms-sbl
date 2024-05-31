import { phpLanguage } from '@codemirror/lang-php'
import useSaveFormula from '@hooks/formula/useSaveFormula'
import useTestFormula from '@hooks/formula/useTestFormula'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { githubLight } from '@uiw/codemirror-theme-github'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useState } from 'react'

const DialogRunCode = ({ open, handleOpen, code }) => {
    const [output, setOutput] = useState({
        color: 'primary',
        message: '',
    })
    const { mutate: test, isLoading: loadingTest, error } = useTestFormula({
        onSuccess: (res) => {
            const temp = res?.data?.result
            if(!!temp){
                setOutput({
                    color:'success',
                    message: temp
                })
            }
        },
        onError: (err) => {
            const temp =  err?.response?.data?.data?.result
            if(!!temp){
                setOutput({
                    color:'error',
                    message: temp
                })
            }
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        setOutput({
            color: 'primary',
            message: '',
        })
        const formElem = document.querySelector('#formElement') 
        const formData = new FormData(formElem)
        formData.append('formula', code)
        formData.append('title', '-')
        formData.append('active', '1')
        test({ formData })

    }
    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={() => {}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>Run Your Code</DialogTitle>
            <DialogContent>
                <Grid container id='formElement' component='form' spacing={2} p={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Total of breakfast/lunch/dinner/supper'
                            type='number'
                            name='total'
                            helperText={!!errors?.total && errors?.total[0]}
                            error={!!errors?.total}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Accomodation'
                            name='accomodation'
                            select
                            helperText={!!errors?.accomodation && errors?.accomodation[0]}
                            error={!!errors?.accomodation}
                        >  
                            <MenuItem value='1'>Yes</MenuItem>
                            <MenuItem value='0'>No</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                            <Typography pl={0.5} mb={2} variant='body2'>Output : </Typography>
                            <TextField
                                focused
                                color={output.color}
                                aria-readonly={true}  
                                fullWidth 
                                value={loadingTest ? 'Loading.....' : output.message}
                                multiline
                                rows={3}
                            />  
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Stack direction='row' justifyContent='end'>
                    <Button color='error' variant="text" onClick={handleOpen}>
                        Cancel
                    </Button>
                    <LoadingButton loading={loadingTest} variant="text" onClick={onSubmit}>
                        Save
                    </LoadingButton>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}


const defaultCode = 
`<?php

    





`;
const Form = (props) => {
    const { data } = props

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)


    const [value, setValue] = useState(!!data?.formula ? data?.formula : defaultCode)
    const handleChange = (val) => {
        setValue(val)
    }
    // HandleSubmit
    const { mutate: save, isLoading: loadingSave, error } = useSaveFormula({
        onSuccess: () => {
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('formula', value)
        save({ formData, id: data?.id })
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input Formula Meal Sheet' : 'Form Edit Formula Meal Sheet' }
                    </Typography>
                </Grid>
            </Grid>

            <Box>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container component='form' onSubmit={onSubmit} spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth 
                                label='Formula Title'
                                name='title'
                                defaultValue={data?.title}
                                required
                                helperText={!!errors?.title && errors?.title[0]}
                                error={!!errors?.title}
                            /> 
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth 
                                label='Status Formula'
                                name='active'
                                defaultValue={data?.active}
                                required
                                helperText={!!errors?.active && errors?.active[0]}
                                error={!!errors?.active}
                                select
                            > 
                                <MenuItem value='1'>Active</MenuItem>
                                <MenuItem value='0'>Not Active</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Stack mb={1} direction='row' alignItems='center' justifyContent='space-between'>
                                    <Typography mb={1} pl={1} variant='body2'>Code of Formula *</Typography>
                                    <Button variant='outlined' color='secondary' onClick={handleOpen}>Run Your Code</Button>
                                </Stack>
                                <ReactCodeMirror 
                                    extensions={phpLanguage}
                                    theme={githubLight}
                                    value={value}
                                    onChange={handleChange}
                                    options={{
                                        mode: 'text/x-php',
                                        theme: 'light',
                                        lineNumbers: true,
                                        lineWrapping: true,
                                    }}
                                />
                                {!!errors?.formula ?
                                    <FormHelperText error={true}>{errors?.formula[0]}</FormHelperText>
                                : null
                                }
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' justifyContent='end' spacing={2}>
                                <LoadingButton loading={loadingSave} variant='contained' type='submit'>
                                    Submit
                                </LoadingButton>
                            </Stack>
                        </Grid>
                    </Grid>
                    <DialogRunCode 
                        code={value}
                        handleOpen={handleOpen}
                        open={open}
                        key={Math.random(10)}
                    />
                </Card>
            </Box>
        </Stack>
    )
}

export default Form