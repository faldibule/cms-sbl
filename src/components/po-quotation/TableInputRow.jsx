import Iconify from "@components/Iconify"
import { Stack, TableCell, TableRow, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import DialogInputRow from "./DialogInputRow"
import { NumberFormat } from "@utils/Format"

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex, errors = {}, isApproved = false }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)

    const price = useMemo(() => parseInt(v?.price) || parseInt(v?.item_price), [v?.price, v?.item_price])
    const total = useMemo(() => (price * (v?.quantity || 0)), [price, v.quantity])
    const tax = useMemo(() => {
        let vat = 11
        if(!!v.vat){
            vat = parseInt(v.vat)
        }
        return total * vat / 100
    }, [total, v.vat])
    const grand_total = useMemo(() => {
        return total + (isNaN(tax) ? 0 : tax)
    }, [total, tax])

    return (
        <TableRow key={i}>
            <TableCell onClick={handleClose} sx={{ cursor: 'pointer' }}>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{v?.item_product?.name || v?.item_name || ''}</TableCell>
            <TableCell>
                {!!v.weight ? v.weight : !!errors[`item_product.${i}.weight`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>Weight required</Typography> : ''}
            </TableCell>
            <TableCell>{v.item_product?.unit?.param || v?.unit || ''}</TableCell>
            <TableCell>
                {v?.quantity || 0}
            </TableCell>
            <TableCell>{NumberFormat(price, 'Rp')}</TableCell>
            <TableCell>
                {v.vat || 11}%
            </TableCell>
            <TableCell>{NumberFormat(tax, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(total, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(grand_total, 'Rp')}</TableCell>
            <TableCell>
                {
                    !!v.tnt ? v.tnt : !!errors[`item_product.${i}.tnt`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>T/NT required</Typography> : ''
                }
            </TableCell>
            <TableCell align='center'>
                {isApproved ?
                '-'
                : 
                <Stack direction='row' spacing={2}>
                    <Iconify onClick={handleClose} icon='material-symbols:edit' sx={{ color: 'green', fontSize: '1rem', cursor: 'pointer' }} />
                    <Iconify onClick={(e) => deleteItemTable(e, i)} icon='material-symbols:delete' sx={{ color: 'red', fontSize: '1rem', cursor: 'pointer' }} />
                </Stack>
                }
                <DialogInputRow 
                    handleClose={handleClose} 
                    open={open} 
                    v={v} 
                    onChangeByIndex={onChangeByIndex}
                    i={i}
                />
            </TableCell>
        </TableRow>
    )
}
export default TableInputRow