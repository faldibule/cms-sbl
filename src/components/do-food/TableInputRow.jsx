import Iconify from "@components/Iconify"
import { Stack, TableCell, TableRow, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import DialogInputRow from "./DialogInputRow"
import { NumberFormat } from "@utils/Format"
import useValueConverter from "@hooks/useValueConverter"

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex, errors = {}, isApproved = false }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)

    const { valueMemo } = useValueConverter(v) 

    return (
        <TableRow key={i}>
            <TableCell onClick={handleClose} sx={{ cursor: 'pointer' }}>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>
                {valueMemo.name}
                {
                    !!errors[`item_product.${i}.item_product_id`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>(duplicate)</Typography> : ''
                }
            </TableCell>
            <TableCell>{valueMemo.brand}</TableCell>
            <TableCell sx={{ minWidth: 150 }} align="left">{valueMemo.description}</TableCell>
            <TableCell>{valueMemo.size}</TableCell>
            <TableCell>{valueMemo.unit}</TableCell>
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