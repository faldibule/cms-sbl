import CustomActionTableComponent from '@components/CustomActionTableComponent'
import CustomLinkComponent from '@components/CustomLinkComponent'
import DeleteDialog from '@components/DeleteDialog'
import UpdateStatusDialog from '@components/UpdateStatusDialog'
import useDeleteQuotation from '@hooks/quotation/useDeleteQuotation'
import useUpdateStatusQuotation from '@hooks/quotation/useUpdateStatusQuotation'
import useApprovalLogic from '@hooks/useApprovalLogic'
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
    const { mutate: deleteQuotation, isLoading: loadingDelete } = useDeleteQuotation({
        onSuccess: () => {
            refetch()
            handleClose()
        },
        onError: () => {
            handleClose()
            failed('Unable to delete this Quotation!')
        }
    })
    const handleDelete = async () => {
        deleteQuotation(value.id)
    }

    const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
    const handleCloseUpdateStatus = (value = null) => {
        setOpenUpdateStatus(!openUpdateStatus)
    }
    const { mutate: updateStatus, isLoading: loadingUpdateStatus } = useUpdateStatusQuotation({
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

    const { user } = useRecoilValue(authentication)

    const statusLabelAndColor = useMemo(()=> {
        const { checked_date, status } = value
        let labelAndColor = {
            label: 'default',
            color: 'primary'
        }
        if(!checked_date){
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
        if(status === 'reject'){
            labelAndColor = {
                label: 'Rejected',
                color: 'error'
            }
        }
        if(status === 'finish'){
            labelAndColor = {
                label: 'Checked',
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

    const isUserCanApprove = useMemo(() => {
        const user_id = user?.id
        const user_checker = value.checked_by
        const isUserChecked = user_id === user_checker.id
        
        if(!value?.checked_date && isUserChecked && value?.status != 'draft' && value?.status != 'reject'){
            return true
        }
        return false

    }, [value, user])

    const isUserPrepared = useMemo(() => {
        if(!value?.prepared_by?.id && (value?.status === 'draft' || value?.status === 'reject')) return true
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
                <CustomLinkComponent label={value.quotation_number} url={`/external-order/quotation/edit/${value.id}`} />
            </TableCell>
            <TableCell>
                {value.pr_customer.pr_number}
            </TableCell>
            <TableCell sx={{ minWidth: 150 }}>
                {value.customer.code}-{value.customer.name}
            </TableCell>
            <TableCell>
                {moment(value.shipment_date).format('LL')}
            </TableCell>
            <TableCell>
                {value.prepared_by.name}
            </TableCell>
            <TableCell>
                <CustomLinkComponent label='View' url={`/file/${value.id}/quotation`} />
            </TableCell>
            <TableCell>
                {value?.note || '-'}
            </TableCell>
            <TableCell>
                <Chip label={statusLabelAndColor.label} color={statusLabelAndColor.color} />
            </TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    approve={value.status !== 'finish' && (isUserCanApprove || isUserPrepared)}
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