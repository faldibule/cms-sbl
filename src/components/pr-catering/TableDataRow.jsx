import CustomActionTableComponent from '@components/CustomActionTableComponent'
import CustomLinkComponent from '@components/CustomLinkComponent'
import DeleteDialog from '@components/DeleteDialog'
import useDeletePRCatering from '@hooks/pr-catering/useDeletePRCatering'
import useCustomSnackbar from '@hooks/useCustomSnackbar'
import { TableCell, TableRow } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'

const TableDataRow = ({ i, value, rows, refetch }) => {
    const [open, setOpen] = useState(false)
    const { failed } = useCustomSnackbar()
    const handleClose = (id = null) => {
        setOpen(!open)
        if(!!!id) return;
    }
    const { mutate: deletePRCatering, isLoading: loadingDelete } = useDeletePRCatering({
        onSuccess: () => {
            refetch()
            handleClose()
        },
        onError: (err) => {
            handleClose()
            failed('Unable to delete this PR Catering!')
        }
    })
    const handleDelete = async () => {
        deletePRCatering(value.id)
    }

    return (
        <TableRow key={i}>
            <TableCell
                component="th"
                scope="row"
                align="center"
            >
                {rows.meta.from+i}.
            </TableCell>
            <TableCell>
                <CustomLinkComponent label={value.pr_number} url={`/internal-order/pr-catering/edit/${value.id}`} />
            </TableCell>
            <TableCell>
                {value.location.location}
            </TableCell>
            <TableCell>
                {moment(value.request_date).format('LL')}
            </TableCell>
            <TableCell>
                {moment(value.delivery_date).format('LL')}
            </TableCell>
            <TableCell>
                {value.prepared_by.name}
            </TableCell>
            <TableCell>
                <CustomLinkComponent label='View History' url={`/internal-order/history-pr-catering/${value.id}`} />
            </TableCell>
            <TableCell>
                <CustomLinkComponent label='View' url={`/file/${value.id}/pr_catering`} />
            </TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    handleDelete={() => handleClose(value.id)}
                    canDelete={!value.po_catering}
                />
                <DeleteDialog 
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                    open={open}
                    loading={loadingDelete}
                />
            </TableCell>                                                             
        </TableRow>
    )
}

export default TableDataRow