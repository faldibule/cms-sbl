import DeleteDialog from "@components/DeleteDialog"
import Iconify from "@components/Iconify"
import useDeleteItemMICSDaily from "@hooks/mics-daily/useDeleteItemMICSDaily"
import useValueConverter from "@hooks/useValueConverter"
import { Stack, TableCell, TableRow, Typography } from "@mui/material"
import { NumberFormat } from "@utils/Format"
import moment from "moment"
import { useState } from "react"
import DialogInputRow from "./DialogInputRow"

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex, errors = {}, isApproved }) => {

    const [deleteDialog, setDeleteDialog] = useState(false)
    const handleDeleteDialog = () => setDeleteDialog(!deleteDialog)

    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)

    const { valueMemo } = useValueConverter(v) 
    const { mutate: deleteItem, isLoading: loadingDelete } = useDeleteItemMICSDaily({
        onSuccess: () => {
            deleteItemTable(null, i)
            handleDeleteDialog()
        }
    })

    const handledDelete = () => {
        if(isApproved){
            handleDeleteDialog()
            return
        }
        deleteItemTable(null, i)
    }

    return (
        <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>
                {!!v?.date ? moment(v?.date).format('LL') : ''}
                {!!errors[`item_product.${i}.date`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem', fontWeight: 'bold' }}>(Date not Valid/Required!)</Typography> : ''}
            </TableCell>
            <TableCell sx={{ minWidth: 150 }}>{v?.item_product?.code || v?.code || v?.item_code || ''}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.name}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.brand}</TableCell>
            <TableCell sx={{ minWidth: 150 }} align="left">{valueMemo.description}</TableCell>
            <TableCell>
                {v.quantity || 0}
            </TableCell>
            <TableCell>{NumberFormat(valueMemo.price, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(valueMemo.price * (v?.quantity || 0), 'Rp')}</TableCell>
            <TableCell>
                <Stack direction='row' spacing={2}>
                    <Iconify onClick={handleClose} icon='material-symbols:edit' sx={{ color: 'green', fontSize: '1rem', cursor: 'pointer' }} />
                    <Iconify onClick={handledDelete} icon='material-symbols:delete' sx={{ color: 'red', fontSize: '1rem', cursor: 'pointer' }} />
                </Stack>
                <DialogInputRow 
                    handleClose={handleClose} 
                    open={open} 
                    v={v} 
                    onChangeByIndex={onChangeByIndex}
                    i={i}
                />
                <DeleteDialog 
                    handleClose={handleDeleteDialog}
                    handleDelete={() => deleteItem(v?.id)}
                    loading={loadingDelete}
                    open={deleteDialog}
                />
            </TableCell>
        </TableRow>
    )
}
export default TableInputRow