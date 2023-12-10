import CustomActionTableComponent from '@components/CustomActionTableComponent'
import CustomLinkComponent from '@components/CustomLinkComponent'
import DeleteDialog from '@components/DeleteDialog'
import useDeletePRCustomer from '@hooks/pr-customer/useDeletePRCustomer'
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
    const { mutate: deletePRCustomer, isLoading: loadingDelete } = useDeletePRCustomer({
        onSuccess: () => {
            refetch()
            handleClose()
        },
        onError: (err) => {
            handleClose()
            failed('Unable to delete this PR Customer!')
        }
    })
    const handleDelete = async () => {
        deletePRCustomer(value.id)
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
                <CustomLinkComponent label={value.pr_number} url={`/external-order/pr-customer/edit/${value.id}`} />
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
                <CustomLinkComponent label='View' url={`/file/${value.id}/pr_customer`} />
            </TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    handleDelete={() => handleClose(value.id)}
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