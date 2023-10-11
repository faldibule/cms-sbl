import useSaveResetPassword from "@hooks/reset-password/useSaveResetPassword"
import { LoadingButton } from "@mui/lab"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField } from "@mui/material"

const ResetPasswordDialog = ({ open, handleClose, userId = null }) => {
    const { mutate: save, isLoading, error } = useSaveResetPassword({
        onSuccess: () => {
            handleClose()
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        save({ formData })
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
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <Grid container id='test' component='form' onSubmit={onSubmit} spacing={2} p={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Old Password'
                            name='old_password'
                            type="password"
                            required
                            defaultValue={''}
                            helperText={!!errors?.old_password && errors?.old_password[0]}
                            error={!!errors?.old_password}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='New Password'
                            name='password'
                            type="password"
                            required
                            defaultValue={''}
                            helperText={!!errors?.password && errors?.password[0]}
                            error={!!errors?.password}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Repeat New Password'
                            name='password_confirmation'
                            type="password"
                            required
                            defaultValue={''}
                            helperText={!!errors?.password_confirmation && errors?.password_confirmation[0]}
                            error={!!errors?.password_confirmation}
                        />  
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction='row' justifyContent='end'>
                            <Stack width='50%' direction='row' justifyContent='end' spacing={2}>
                                <Button fullWidth color='error' variant="text" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <LoadingButton loading={isLoading} fullWidth type="submit" variant="contained">
                                    Save
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
            
        </Dialog>
    )
}

export default ResetPasswordDialog