import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteQuotation = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`quotation/${id}`)
            success('Success Delete Quotation!')
        },
        onSuccess,
        onError,
    })
}

export default useDeleteQuotation