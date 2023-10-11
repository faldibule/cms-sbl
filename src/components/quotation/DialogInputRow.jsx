import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField } from "@mui/material"

const DialogInputRow = ({ open, handleClose, v, onChangeByIndex, i }) => {
    const onSubmit = (e) => {
        e.preventDefault()
        const formElem = document.querySelector('#test') 
        const formData = new FormData(formElem)
        const formObject = Object.fromEntries(formData)
        onChangeByIndex(i, formObject)
        handleClose()
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
            <DialogTitle>Edit Form {v.name}</DialogTitle>
            <DialogContent>
                <Grid container id='test' component='form' spacing={2} p={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Quantity'
                            type='number'
                            name='quantity'
                            defaultValue={v?.quantity}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            name='vat'
                            type='number'
                            label='VAT'
                            defaultValue={v?.vat}
                        /> 
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='T/NT'
                            name='tnt'
                            defaultValue={v?.tnt}
                            select
                        >
                            <MenuItem value='T'>T</MenuItem>
                            <MenuItem value='NT'>NT</MenuItem>
                        </TextField> 
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Remarks'
                            name='remarks'
                            defaultValue={v?.remarks}
                            multiline
                            rows={3}
                        /> 
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Stack direction='row' justifyContent='end'>
                    <Button color='error' variant="text" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="text" onClick={onSubmit}>
                        Save
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

export default DialogInputRow