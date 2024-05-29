import useUpdateItemMICSDaily from "@hooks/mics-daily/useUpdateItemMICSDaily"
import { LoadingButton } from "@mui/lab"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, Stack, TextField } from "@mui/material"
import { IntegerFormat, NumberFormat } from "@utils/Format"
import { useState } from "react"
import { useParams } from "react-router-dom"

const DialogInputRow = ({ open, handleClose, v, onChangeByIndex, i }) => {
    const { date } = useParams()
    const [price, setPrice] = useState(NumberFormat(v.price || parseInt(v?.item_price), 'Rp'))
    const handlePrice = (v) => setPrice(NumberFormat(v, 'Rp'))

    const { mutate: update, isLoading: loadingSubmit } = useUpdateItemMICSDaily({
        onSuccess: (formObject) => {
            onChangeByIndex(i, formObject)
            handleClose()
        }
    })

    const onSubmit = (e) => {
        e.preventDefault()
        const formElem = document.querySelector('#formElement') 
        const formData = new FormData(formElem)
        formData.append('price', IntegerFormat(price))
        if(!!date){
            formData.append('item_price', IntegerFormat(price))
            update({ formData, id: v?.id })
            return
        }
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
                            type='date'
                            label="Delivery Date"
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            name='date'
                            defaultValue={v?.date}
                            required
                        />
                    </Grid>
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
                    <LoadingButton loading={loadingSubmit} variant="text" onClick={onSubmit}>
                        Save
                    </LoadingButton>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

export default DialogInputRow