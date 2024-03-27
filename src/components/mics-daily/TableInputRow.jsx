import Iconify from "@components/Iconify"
import useValueConverter from "@hooks/useValueConverter"
import { Stack, TableCell, TableRow, Typography } from "@mui/material"
import { NumberFormat } from "@utils/Format"
import moment from "moment"
import { useState } from "react"
import DialogInputRow from "./DialogInputRow"

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex, errors = {}, isApproved }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)

    const { valueMemo } = useValueConverter(v) 

    return (
        <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>
                {!!v?.date ? moment(v?.date).format('LL') : ''}
                {!!errors[`item_product.${i}.date`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem', fontWeight: 'bold' }}>(Date not Valid/Required!)</Typography> : ''}
            </TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.name}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.brand}</TableCell>
            <TableCell sx={{ minWidth: 150 }} align="left">{valueMemo.description}</TableCell>
            <TableCell>
                {v.quantity || 0}
            </TableCell>
            <TableCell>{NumberFormat(valueMemo.price, 'Rp')}</TableCell>
            <TableCell>
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