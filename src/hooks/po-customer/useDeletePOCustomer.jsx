import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePOCustomer = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`po-customer/${id}`)
            success('Success Delete PO Customer!')
        },
        onSuccess,
        onError,
    })
}

export default useDeletePOCustomer