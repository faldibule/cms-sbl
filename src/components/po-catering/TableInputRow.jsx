import Iconify from "@components/Iconify"
import useValueConverter from "@hooks/useValueConverter"
import { Stack, TableCell, TableRow, Typography } from "@mui/material"
import { NumberFormat } from "@utils/Format"
import { useState } from "react"
import DialogInputRow from "./DialogInputRow"

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex, errors = {}, isApproved }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)

    const { valueMemo, tax, total, grand_total } = useValueConverter(v) 

    return (
        <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.name}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.brand}</TableCell>
            <TableCell sx={{ minWidth: 150 }} align="left">{valueMemo.description}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.size}</TableCell>
            <TableCell>{valueMemo.unit}</TableCell>
            <TableCell>{NumberFormat(valueMemo.price, 'Rp')}</TableCell>
            <TableCell>
                {v.quantity || 0}
            </TableCell>
            <TableCell>
                {v.vat || 11}%
            </TableCell>
            <TableCell>{valueMemo.tax !== 'yes' ? 'No' : NumberFormat(tax, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(total, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(grand_total, 'Rp')}</TableCell>
            <TableCell sx={{ minWidth: 100 }} align="left">
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