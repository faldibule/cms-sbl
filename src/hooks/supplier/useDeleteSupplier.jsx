import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteSupplier = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`supplier/${id}`)
            success('Success Delete Supplier!')
        },
        onSuccess,
    })
}

export default useDeleteSupplier