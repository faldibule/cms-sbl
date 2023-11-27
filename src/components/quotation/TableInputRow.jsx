import Iconify from "@components/Iconify"
import { Stack, TableCell, TableRow, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import DialogInputRow from "./DialogInputRow"
import { NumberFormat } from "@utils/Format"
import useValueConverter from "@hooks/useValueConverter"

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex, errors = {}, isApproved, markup = 0 }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)
    
    const { valueMemo, tax, total, grand_total, markUpMemo, eachTax, newPrice } = useValueConverter(v, markup) 

    return (
        <TableRow key={i}>
            <TableCell onClick={handleClose} sx={{ cursor: 'pointer' }}>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>
                {valueMemo.name}
                {
                    !!errors[`item_product.${i}.item_product_id`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>(duplicate)</Typography> : ''
                }
            </TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.size}</TableCell>
            <TableCell>{valueMemo.unit}</TableCell>
            <TableCell>
                {v?.quantity || 0}
            </TableCell>
            <TableCell>{NumberFormat(valueMemo.price, 'Rp')}</TableCell>
            <TableCell>
                {valueMemo.tax !== 'yes' ? 'No' : NumberFormat(eachTax, 'Rp')}({v.vat || 11}%)
            </TableCell>
            <TableCell>{valueMemo.tax !== 'yes' ? 'No' : NumberFormat(newPrice, 'Rp')}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{markup === 0 ? 0 : NumberFormat(markUpMemo.markupPrice, 'Rp')}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{NumberFormat(markUpMemo.markupTotal, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(grand_total, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(grand_total + markUpMemo.markupTotal, 'Rp')}</TableCell>
            <TableCell>
                {
                    !!v.tnt ? v.tnt : !!errors[`item_product.${i}.tnt`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>T/NT required</Typography> : ''
                }
            </TableCell>
            <TableCell>
                {
                    !!v.remark ? v.remark : !!errors[`item_product.${i}.remark`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>Remark required</Typography> : ''
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
                    priceProps={valueMemo.price}
                />
            </TableCell>
        </TableRow>
    )
}
export default TableInputRow