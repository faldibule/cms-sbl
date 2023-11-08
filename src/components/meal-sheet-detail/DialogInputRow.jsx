import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Grid, Stack, TextField } from "@mui/material"
import { IntegerFormat, NumberFormat } from "@utils/Format"
import { useState } from "react"

const DialogInputRow = ({ open, handleClose, v, onChangeByIndex, i }) => {
    const onSubmit = (e) => {
        e.preventDefault()
        const formElem = document.querySelector('#formElement') 
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
            <DialogTitle>Form Detail</DialogTitle>
            <DialogContent>
                <Grid container id='formElement' component='form' spacing={2} p={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Name'
                            name='name'
                            defaultValue={v?.name}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Position'
                            name='position'
                            defaultValue={v?.position}
                        />  
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup sx={{ display: 'flex', ml: 1, justifyContent: { xs: 'space-evenly', md: 'inherit' }}} row={true}>
                            <FormControlLabel name="breakfast" control={<Checkbox defaultChecked={v?.breakfast}  />} label="Breakfast" />
                            <FormControlLabel name="lunch" control={<Checkbox defaultChecked={v?.lunch}  />} label="Lunch" />
                            <FormControlLabel name="casual" control={<Checkbox defaultChecked={v?.casual}  />} label="Casual" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup sx={{ display: 'flex', ml: 1, justifyContent: { xs: 'space-evenly', md: 'inherit' }}} row={true}>
                            <FormControlLabel name="dinner" control={<Checkbox defaultChecked={v?.dinner}  />} label="Dinner" />
                            <FormControlLabel name="super" control={<Checkbox defaultChecked={v?.super}  />} label="Super" />
                            <FormControlLabel name="acomodation" control={<Checkbox defaultChecked={v?.acomodation}  />} label="Acomodation" />
                        </FormGroup>
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