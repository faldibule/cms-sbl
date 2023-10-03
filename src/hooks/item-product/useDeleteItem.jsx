import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteItemProduct = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`item-category/${id}`)
            success('Success Delete Item!')
        },
        onSuccess,
    })
}

export default useDeleteItemProduct