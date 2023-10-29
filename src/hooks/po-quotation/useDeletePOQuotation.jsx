import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePOQuotation = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`outgoing-po/${id}`)
            success('Success Delete PO Keluar Quotation!')
        },
        onSuccess,
    })
}

export default useDeletePOQuotation