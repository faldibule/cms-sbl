import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteQuotation = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`quotation/${id}`)
            success('Success Delete Quotation!')
        },
        onSuccess,
    })
}

export default useDeleteQuotation