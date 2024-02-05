import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField } from "@mui/material"
import { IntegerFormat, NumberFormat } from "@utils/Format"
import { useState } from "react"

const DialogInputRow = ({ open, handleClose, v, onChangeByIndex, i }) => {
    const [price, setPrice] = useState(NumberFormat(v.price || parseInt(v?.item_price), 'Rp'))
    const handlePrice = (v) => setPrice(NumberFormat(v, 'Rp'))

    const onSubmit = (e) => {
        e.preventDefault()
        const formElem = document.querySelector('#formElement') 
        const formData = new FormData(formElem)
        formData.append('price', IntegerFormat(price))
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
                <Grid container id='formElement' component='form' spacing={2} p={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Last Stock'
                            type='number'
                            name='last_stock'
                            defaultValue={v?.last_stock || 0}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Price'
                            name='price'
                            value={price}
                            onChange={(e) => handlePrice(e.target.value)}
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