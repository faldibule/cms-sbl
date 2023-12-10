import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useUpdateStatusPOSupplierCustomer = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ type, status, id, note = null }) => {
            if(type === 'update-status'){
                const res = await http.patch(`po-supplier-customer/${id}/update-status`, {}, {
                    params: {
                       status,
                       note,
                    }
                })
            }else{
                const res = await http.patch(`po-supplier-customer/${id}/update-approval-status`, {}, {
                    params: {
                       status,
                    }
                })
            }
            success('Success Update Status PO Supplier Customer!')
        },
        onSuccess,
    })
}

export default useUpdateStatusPOSupplierCustomer