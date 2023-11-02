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
        if(v?.item_product?.tax !== 'yes'){
            return 0
        }
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
            <TableCell>{v?.item_product?.name || v?.item_name || ''}</TableCell>
            <TableCell>{v?.item_product?.brand || v?.item_brand || ''}</TableCell>
            <TableCell sx={{ minWidth: 150 }} align="left">{v.item_product?.description || v.item_description}</TableCell>
            <TableCell>{v?.item_product?.size || v?.item_size || ''}</TableCell>
            <TableCell>{v.item_product?.unit?.param || v?.unit || ''}</TableCell>
            <TableCell>
                {v?.quantity || 0}
            </TableCell>
            <TableCell align='center'>
                {isApproved ?
                '-'
                : 
                <Stack justifyContent='center' direction='row' spacing={2}>
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