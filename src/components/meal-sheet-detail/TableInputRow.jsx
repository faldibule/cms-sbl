import Iconify from "@components/Iconify"
import { Stack, TableCell, TableRow, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import DialogInputRow from "./DialogInputRow"
import { NumberFormat } from "@utils/Format"
import useValueConverter from "@hooks/useValueConverter"

const CheckStatusComponent = ({ isChecked }) => {
    if(isChecked){
        return <Iconify icon='mdi:check-bold' sx={{ color: 'green', fontSize: '1rem' }} />
    }
    return <Iconify icon='mingcute:close-fill' sx={{ color: 'red', fontSize: '1rem' }} />
}

const exceptProperti = ['name', 'position', 'company', 'acomodation']
const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex, errors = {}, isApproved }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)

    const valueMemo = useMemo(() => {
        return {
            name: v.name, 
            position: v.position, 
            company: v.company, 
            breakfast: v.breakfast, 
            lunch: v.lunch, 
            casual: v.casual, 
            dinner: v.dinner, 
            super: v.super, 
            acomodation: v.acomodation, 
        }
    }, [v])
    const total = useMemo(() => {
        let onCount = 0;
        for (const key in valueMemo) {
            if ((valueMemo[key] === "on" || valueMemo[key] === 1)  && !exceptProperti.includes(key)) {
                onCount++;
            }
        }
        return onCount;
    }, [valueMemo]);

    return (
        <TableRow key={i}>
            <TableCell onClick={handleClose} sx={{ cursor: 'pointer' }}>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.name}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.position}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.company}</TableCell>
            <TableCell>
                <CheckStatusComponent isChecked={!!valueMemo.breakfast} />
            </TableCell>
            <TableCell>
                <CheckStatusComponent isChecked={!!valueMemo.lunch} />
            </TableCell>
            <TableCell>
                <CheckStatusComponent isChecked={!!valueMemo.dinner} />
            </TableCell>
            <TableCell>
                <CheckStatusComponent isChecked={!!valueMemo.super} />
            </TableCell>
            <TableCell>
                {total}
            </TableCell>
            <TableCell>
                <CheckStatusComponent isChecked={!!valueMemo.acomodation} />
            </TableCell>
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