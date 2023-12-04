import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePOSupplierCatering = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`po-supplier-catering/${id}`)
            success('Success Delete PO Supplier Catering!')
        },
        onSuccess,
        onError,
    })
}

export default useDeletePOSupplierCatering