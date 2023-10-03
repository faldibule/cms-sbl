import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteCategory = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`item-category/${id}`)
            success('Success Delete Category!')
        },
        onSuccess,
    })
}

export default useDeleteCategory