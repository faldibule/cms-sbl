import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePOSupplierCustomer = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`po-supplier-customer/${id}`)
            success('Success Delete PO Supplier Customer!')
        },
        onSuccess,
        onError,
    })
}

export default useDeletePOSupplierCustomer