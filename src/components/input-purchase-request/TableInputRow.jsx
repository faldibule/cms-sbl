import Iconify from "@components/Iconify"
import { Stack, TableCell, TableRow } from "@mui/material"
import { useMemo, useState } from "react"
import DialogInputRow from "./DialogInputRow"
import { NumberFormat } from "@utils/Format"

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)
    const total = useMemo(() => (v.harga * v.quantity), [v.harga, v.quantity])
    const tax = useMemo(() => total * parseInt(v.vat) / 100, [total, v.vat])
    const grand_total = useMemo(() => total + tax, [total, tax])
    return (
        <TableRow hover key={i}>
            <TableCell onClick={handleClose} sx={{ cursor: 'pointer' }}>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 100 }}>{v.name}</TableCell>
            <TableCell sx={{ minWidth: 100 }}>{v.brand}</TableCell>
            <TableCell sx={{ minWidth: 100 }} align="left">
                {v.description}
            </TableCell>
            <TableCell>KG</TableCell>
            <TableCell>{NumberFormat(v.harga, 'Rp')}</TableCell>
            <TableCell>
                {v.quantity}
            </TableCell>
            <TableCell>
                {v.vat}
            </TableCell>
            <TableCell>{NumberFormat(tax, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(total, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(grand_total, 'Rp')}</TableCell>
            <TableCell align='center'>
                <Stack direction='row' spacing={2}>
                    <Iconify onClick={handleClose} icon='material-symbols:edit' sx={{ color: 'green', fontSize: '1rem', cursor: 'pointer' }} />
                    <Iconify onClick={(e) => deleteItemTable(e, i)} icon='material-symbols:delete' sx={{ color: 'red', fontSize: '1rem', cursor: 'pointer' }} />
                </Stack>
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