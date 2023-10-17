import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePurchaseRequest = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`purchase-request/${id}`)
            success('Success Delete Purchase Request!')
        },
        onSuccess,
    })
}

export default useDeletePurchaseRequest