import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteItemProduct = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`item-product/${id}`)
            success('Success Delete Item Product!')
        },
        onSuccess,
        onError,
    })
}

export default useDeleteItemProduct