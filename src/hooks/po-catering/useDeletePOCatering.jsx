import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePOCatering = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`catering-po/${id}`)
            success('Success Delete PO Catering!')
        },
        onSuccess,
    })
}

export default useDeletePOCatering