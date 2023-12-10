import CustomActionTableComponent from '@components/CustomActionTableComponent'
import CustomLinkComponent from '@components/CustomLinkComponent'
import DeleteDialog from '@components/DeleteDialog'
import UpdateStatusDialog from '@components/UpdateStatusDialog'
import useDeleteDOCustomer from '@hooks/do-customer/useDeleteDOCustomer'
import useUpdateStatusDOCustomer from '@hooks/do-customer/useUpdateStatusDOCustomer'
import useDeletePOCustomer from '@hooks/po-customer/useDeletePOCustomer'
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
    const { mutate: deleteDOCustomer, isLoading: loadingDelete } = useDeleteDOCustomer({
        onSuccess: () => {
            refetch()
            handleClose()
        },
        onError: (err) => {
            handleClose()
            failed('Unable to delete this DO Customer!')
        }
    })
    const handleDelete = async () => {
        deleteDOCustomer(value.id)
    }

    const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
    const handleCloseUpdateStatus = (value = null) => {
        setOpenUpdateStatus(!openUpdateStatus)
    }
    const { mutate: updateStatus, isLoading: loadingUpdateStatus } = useUpdateStatusDOCustomer({
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
        if(!!!value?.approved_date){
            status = 'approved'
        }
        updateStatus({ type: 'update-approval-status', status, id: value.id })
    }

    const statusLabelAndColor = useMemo(()=> {
        const { status, approved_date } = value
        let labelAndColor = {
            label: 'default',
            color: 'primary'
        }
        if(!!approved_date){
            labelAndColor = {
                label: 'Approved',
                color: 'success'
            }
        }
        if(status === 'reject'){
            labelAndColor = {
                label: 'Rejected',
                color: 'error'
            }
        }
        if(status === 'submit'){
            labelAndColor = {
                label: 'Pending',
                color: 'warning'
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
        const user_approver = value.approved_by
        const isUserApproved = user_id === user_approver.id

        if(!value?.approved_date && isUserApproved && value?.status != 'draft' && value?.status != 'reject'){
            return true
        }
        
        return false

    }, [value, user])
    const isUserCanSubmit = useMemo(() => {
        return value?.status === 'draft' || value?.status === 'reject'
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
                <CustomLinkComponent label={value.do_number} url={`/external-order/do-customer/edit/${value.id}`} />
            </TableCell>
            <TableCell>
                {value.po_customer.po_number}
            </TableCell>
            <TableCell>
                {value.pr_customer.location.location}
            </TableCell>
            <TableCell>
                {moment(value.pr_customer.request_date).format('LL')}
            </TableCell>
            <TableCell>
                {value.approved_by.name}
            </TableCell>
            <TableCell>
                <CustomLinkComponent label='View' url={`/file/${value.id}/do_customer`} />
            </TableCell>
            <TableCell>
                {value.note || '-'}
            </TableCell>
            <TableCell>
                <Chip label={statusLabelAndColor.label} color={statusLabelAndColor.color} />
            </TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    approve={value.status !== 'finish' && (isUserCanApprove || isUserCanSubmit)}
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