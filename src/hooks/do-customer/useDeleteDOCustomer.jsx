import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteDOCustomer = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`do-customer/${id}`)
            success('Success Delete DO Customer!')
        },
        onSuccess,
    })
}

export default useDeleteDOCustomer