import useValueConverter from "@hooks/useValueConverter"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, MenuItem, Stack, TextField } from "@mui/material"
import { IntegerFormat, NumberFormat } from "@utils/Format"
import { useEffect, useState } from "react"

const DialogInputRow = ({ open, handleClose, v, onChangeByIndex, i, priceProps, markupProps }) => {
    const [price, setPrice] = useState(0)
    const handlePrice = (v) => setPrice(NumberFormat(v, 'Rp'))
    const { newPrice } = useValueConverter(v) 

    const [markup, setMarkup] = useState({
        price: 0,
        percentage: 0,
    })
    const handleMarkup = (e) => {
        const convertedPrice = newPrice
        if(e.target.name === 'markupPercentage') {
            setMarkup({
                ...markup,
                percentage: e.target.value,
                price: NumberFormat((e.target.value * convertedPrice / 100), 'Rp') 
            })
            return
        } 
        const tempMarkupPrice = IntegerFormat(e.target.value)
        setMarkup({
            ...markup,
            price: NumberFormat(e.target.value, 'Rp'),
            percentage: (tempMarkupPrice / convertedPrice * 100),
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            handlePrice(priceProps)
            setMarkup({
                ...markup,
                percentage: parseFloat(markupProps.percentage).toFixed(2),
                price: NumberFormat(( markupProps.price * newPrice / 100), 'Rp') 
            })
        }
        
        return () => mounted = false

    }, [priceProps, markupProps])
    
    const onSubmit = (e) => {
        e.preventDefault()
        const formElem = document.querySelector('#formElement') 
        const formData = new FormData(formElem)
        formData.append('price', IntegerFormat(price))
        formData.append('markupPercentage', markup.percentage)
        formData.append('markupPrice', IntegerFormat(markup.price))
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
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label='Markup Percentage'
                            type='number'
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            name='markupPercentage'
                            onChange={handleMarkup}
                            value={markup.percentage}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth 
                            label='Markup Price'
                            name='markupPrice'
                            value={markup.price}
                            onChange={handleMarkup}
                        />  
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            name='vat'
                            type='number'
                            label='VAT'
                            defaultValue={v?.vat || 11}
                        /> 
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='T/NT'
                            name='tnt'
                            defaultValue={v?.tnt || 'T'}
                            select
                        >
                            <MenuItem value='T'>T</MenuItem>
                            <MenuItem value='NT'>NT</MenuItem>
                        </TextField> 
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Remark'
                            name='remark'
                            defaultValue={v?.remark}
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