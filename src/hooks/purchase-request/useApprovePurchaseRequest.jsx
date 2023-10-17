import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useApprovePurchaseRequest = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ status, id }) => {
            const res = await http.patch(`purchase-request/${id}/update-status`, {}, {
                params: {
                   status,
                }
            })
            success('Success Update Status!')
        },
        onSuccess,
    })
}

export default useApprovePurchaseRequest