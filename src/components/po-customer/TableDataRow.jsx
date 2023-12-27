import CustomActionTableComponent from '@components/CustomActionTableComponent'
import CustomLinkComponent from '@components/CustomLinkComponent'
import DeleteDialog from '@components/DeleteDialog'
import UpdateStatusDialog from '@components/UpdateStatusDialog'
import useDeletePOCustomer from '@hooks/po-customer/useDeletePOCustomer'
import useUpdateStatusPOCustomer from '@hooks/po-customer/useUpdateStatusPOCustomer'
import useCustomSnackbar from '@hooks/useCustomSnackbar'
import { Chip, TableCell, TableRow } from '@mui/material'
import { authentication } from '@recoil/Authentication'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

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

    const { failed } = useCustomSnackbar()
    const { mutate: deletePOCustomer, isLoading: loadingDelete, error } = useDeletePOCustomer({
        onSuccess: () => {
            refetch()
            handleClose()
        },
        onError: (err) => {
            handleClose()
            failed('Unable to delete this PO Customer!')
        }
    })
    const handleDelete = async () => {
        deletePOCustomer(value.id)
    }

    const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
    const handleCloseUpdateStatus = (value = null) => {
        setOpenUpdateStatus(!openUpdateStatus)
    }
    const { mutate: updateStatus, isLoading: loadingUpdateStatus } = useUpdateStatusPOCustomer({
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
        if(!value?.approved2_date){
            status = 'approved2'
        }
        if(!value?.approved1_date){
            status = 'approved1'
        }
        updateStatus({ type: 'update-approval-status', status, id: value.id })
    }

    const statusLabelAndColor = useMemo(()=> {
        const { status, approved1_date, approved2_date } = value
        let labelAndColor = {
            label: 'default',
            color: 'primary'
        }
        if(!!approved1_date){
            labelAndColor = {
                label: 'Approved 1',
                color: 'success'
            }
        }
        if(!!approved2_date){
            labelAndColor = {
                label: 'Approved 2',
                color: 'success'
            }
        }
        if(!approved1_date && !approved2_date){
            labelAndColor = {
                label: 'Pending',
                color: 'warning'
            }
        }
        if(status === 'reject'){
            labelAndColor = {
                label: 'Rejected',
                color: 'error'
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

    const { user } = useRecoilValue(authentication)
    const isUserCanApprove = useMemo(() => {
        const user_id = user?.id
        const user_approver1 = value.approved1_by
        const isUserApproved1 = user_id === user_approver1.id

        const user_approver2 = value.approved2_by
        const isUserApproved2 = user_id === user_approver2.id

        if(!value?.approved2_date && isUserApproved2 && !!value?.approved1_date){
            return true
        }
        if(!value?.approved1_date && isUserApproved1 && value?.status != 'draft' && value?.status != 'reject'){
            return true
        }
        
        return false

    }, [value, user])

    const isUserPrepared = useMemo(() => {
        return user?.id === value.prepared_by?.id && (value?.status === 'draft' || value?.status === 'reject')
    }, [value, user])

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
                <CustomLinkComponent label={value.po_number} url={`/external-order/po-customer/edit/${value.id}`} />
            </TableCell>
            <TableCell>
                {value.quotation.quotation_number}
            </TableCell>
            <TableCell>
                {value.pr_customer.location.location}
            </TableCell>
            <TableCell>
                {moment(value.pr_customer.request_date).format('LL')}
            </TableCell>
            <TableCell>
                {value.prepared_by.name}
            </TableCell>
            <TableCell>
                <CustomLinkComponent label='View' url={`/file/${value.id}/po_customer`} />
            </TableCell>
            <TableCell>
                {value.note || '-'}
            </TableCell>
            <TableCell>
                <Chip label={statusLabelAndColor.label} color={statusLabelAndColor.color} />
            </TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    approve={value.status !== 'finish' && (isUserCanApprove || isUserPrepared)}
                    handleApprove={() => handleCloseUpdateStatus(value)}

                    canDelete={value.status !== 'submit'}
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