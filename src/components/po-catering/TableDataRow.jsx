import CustomActionTableComponent from '@components/CustomActionTableComponent'
import CustomLinkComponent from '@components/CustomLinkComponent'
import DeleteDialog from '@components/DeleteDialog'
import UpdateStatusDialog from '@components/UpdateStatusDialog'
import useDeletePOCatering from '@hooks/po-catering/useDeletePOCatering'
import useUpdateStatusPOCatering from '@hooks/po-catering/useUpdateStatusPOCatering'
import { Chip, TableCell, TableRow } from '@mui/material'
import moment from 'moment'
import React, { useMemo, useState } from 'react'

const TableDataRow = ({ i, value, rows, refetch }) => {
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
    const { mutate: deletePurchaseRequest, isLoading: loadingDelete } = useDeletePOCatering({
        onSuccess: () => {
            refetch()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deletePurchaseRequest(value.id)
    }

    const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
    const handleCloseUpdateStatus = (value = null) => {
        setOpenUpdateStatus(!openUpdateStatus)
    }
    const { mutate: updateStatus, isLoading: loadingUpdateStatus } = useUpdateStatusPOCatering({
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
        const { checked_date, approved1_date, approved2_date, status } = value
        let labelAndColor = {
            label: 'default',
            color: 'primary'
        }
        if(!!!checked_date && !!!approved1_date && !!!approved2_date){
            labelAndColor = {
                label: 'Pending',
                color: 'warning'
            }
        }
        if(!!checked_date){
            labelAndColor = {
                label: 'Checked',
                color: 'primary'
            }
        }
        if(!!approved1_date && !!approved2_date){
            labelAndColor = {
                label: 'Checked',
                color: 'primary'
            }
        }
        if(status === 'reject'){
            labelAndColor = {
                label: 'Rejected',
                color: 'error'
            }
        }
        if(status === 'finish'){
            labelAndColor = {
                label: 'Approved',
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
                <CustomLinkComponent label={value.po_number} url={`/purchase-order/po-catering/edit/${value.id}`} />
            </TableCell>
            <TableCell>
                {value.location.location}
            </TableCell>
            <TableCell>
                {moment(value.shipment_date).format('LL')}
            </TableCell>
            <TableCell>
                {value.prepared_by.name}
            </TableCell>
            <TableCell>
                {value?.note || '-'}
            </TableCell>
            <TableCell>
                <Chip label={statusLabelAndColor.label} color={statusLabelAndColor.color} />
            </TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    approve={value.status !== 'finish'}
                    handleApprove={() => handleCloseUpdateStatus(value)}
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