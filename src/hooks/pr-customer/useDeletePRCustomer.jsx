import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePRCustomer = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`pr-customer/${id}`)
            success('Success Delete PR Customer!')
        },
        onSuccess,
        onError,
    })
}

export default useDeletePRCustomer