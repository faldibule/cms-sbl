import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteItemCategory = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`item-category/${id}`)
            success('Success Delete Item Category!')
        },
        onSuccess,
    })
}

export default useDeleteItemCategory