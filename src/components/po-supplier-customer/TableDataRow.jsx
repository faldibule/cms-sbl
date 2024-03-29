import CustomActionTableComponent from '@components/CustomActionTableComponent'
import CustomLinkComponent from '@components/CustomLinkComponent'
import DeleteDialog from '@components/DeleteDialog'
import UpdateStatusDialog from '@components/UpdateStatusDialog'
import useDeletePOSupplierCustomer from '@hooks/po-supplier-customer/useDeletePOSupplierCustomer'
import useUpdateStatusPOSupplierCustomer from '@hooks/po-supplier-customer/useUpdateStatusPOSupplierCustomer'
import useCustomSnackbar from '@hooks/useCustomSnackbar'
import useIsStoreKeeper from '@hooks/useIsStoreKeeper'
import { Chip, TableCell, TableRow } from '@mui/material'
import moment from 'moment'
import { useMemo, useState } from 'react'

const TableDataRow = ({ i, value, rows, refetch }) => {
    const isUserStoreKeeper = useIsStoreKeeper()

    const [form, setForm] = useState({
        status: '',
        note: ''
     })
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value})
    const [open, setOpen] = useState(false)
    const handleClose = (id = null) => {
        setOpen(!open)
        if(!!!id) return;
    }

    const { failed } = useCustomSnackbar()
    const { mutate: deletePOSupplierCustomer, isLoading: loadingDelete, error } = useDeletePOSupplierCustomer({
        onSuccess: () => {
            refetch()
            handleClose()
        },
        onError: (err) => {
            handleClose()
            failed('Unable to delete this PO Supplier Customer!')
        }
    })
    const handleDelete = async () => {
        deletePOSupplierCustomer(value.id)
    }

    const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
    const handleCloseUpdateStatus = (value = null) => {
        setOpenUpdateStatus(!openUpdateStatus)
    }
    const { mutate: updateStatus, isLoading: loadingUpdateStatus } = useUpdateStatusPOSupplierCustomer({
        onSuccess: () =>{
            handleCloseUpdateStatus()
            setForm({
                status: '',
                note: ''
            })
            refetch()
        }
    })
    const handleUpdateStatus = async () => {
        updateStatus({ type: 'update-status', status: 'submit', id: value.id })
    }
    const handleReject = async (note) => {
        updateStatus({ type: 'update-status', status: 'reject', id: value.id, note })
    }
    const handleUpdateStatusApproval = async () => {
        let status = ''
        if(!!!value?.approved2_date){
            status = 'approved2'
        }
        if(!!!value?.approved1_date){
            status = 'approved1'
        }
        if(!!!value?.checked_date){
            status = 'checked'
        }
        updateStatus({ type: 'update-approval-status', status, id: value.id })
    }

    const statusLabelAndColor = useMemo(()=> {
        const { status } = value
        let labelAndColor = {
            label: 'default',
            color: 'primary'
        }
        if(status === 'submit'){
            labelAndColor = {
                label: 'Submited',
                color: 'success'
            }
        }
        if(status === 'draft'){
            labelAndColor = {
                label: 'Draft',
                color: 'warning'
            }
        }
        return labelAndColor
    }, [value])

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
                <CustomLinkComponent label={value.po_number} url={`/external-order/po-supplier-customer/edit/${value.id}`} />
            </TableCell>
            <TableCell>
                {value.po_customer.po_number}
            </TableCell>
            <TableCell>
                {value.supplier.name}
            </TableCell>
            <TableCell>
                {value.pr_customer.location.location}
            </TableCell>
            <TableCell>
                {moment(value.pr_customer.request_date).format('LL')}
            </TableCell>
            <TableCell>
                <CustomLinkComponent label='View' url={`/file/${value.id}/po_supplier_customer`} />
            </TableCell>
            <TableCell>
                <Chip label={statusLabelAndColor.label} color={statusLabelAndColor.color} />
            </TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    approve={value.status !== 'submit'}
                    handleApprove={() => handleCloseUpdateStatus(value)}

                    canDelete={value.status !== 'submit' || isUserStoreKeeper}
                    handleDelete={() => handleClose(value.id)}
                />
                <DeleteDialog 
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                    open={open}
                    loading={loadingDelete}
                />
                <UpdateStatusDialog 
                    value={value}
                    handleClose={handleCloseUpdateStatus}
                    handleSubmit={handleUpdateStatus}
                    handleReject={handleReject}
                    handleUpdateStatusApproval={handleUpdateStatusApproval}
                    open={openUpdateStatus}
                    loading={loadingUpdateStatus}
                    form={form}
                    handleChange={handleChange}
                />
            </TableCell>                                                             
        </TableRow>
    )
}

export default TableDataRow