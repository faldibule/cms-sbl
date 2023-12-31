import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePOCatering = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`po-catering/${id}`)
            success('Success Delete PO Catering!')
        },
        onSuccess,
        onError,
    })
}

export default useDeletePOCatering