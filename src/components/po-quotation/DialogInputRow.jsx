import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField } from "@mui/material"
import { IntegerFormat, NumberFormat } from "@utils/Format"
import { useState } from "react"

const DialogInputRow = ({ open, handleClose, v, onChangeByIndex, i }) => {
    const [shipmentCharge, setShipmentCharge] = useState(v?.shipment_charge || '')
    const handleShipmentCharge = (value) => setShipmentCharge(NumberFormat(value, 'Rp'))
    const onSubmit = (e) => {
        e.preventDefault()
        const formElem = document.querySelector('#test') 
        const formData = new FormData(formElem)
        formData.append('shipment_charge', IntegerFormat(shipmentCharge))
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
                            defaultValue={v?.quantity || 0}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            name='vat'
                            type='number'
                            label='VAT'
                            defaultValue={v?.vat || 0}
                        /> 
                    </Grid>
                    {/* <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            name='shipment_charge'
                            label='Shipment charge'
                            value={shipmentCharge}
                            onChange={(e) => handleShipmentCharge(e.target.value)}
                        /> 
                    </Grid> */}
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Description'
                            name='description'
                            defaultValue={v?.description}
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