import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteDiscount = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`discount/${id}`)
            success('Success Delete Discount!')
        },
        onSuccess,
    })
}

export default useDeleteDiscount