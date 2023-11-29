import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePRCatering = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`pr-catering/${id}`)
            success('Success Delete PR Catering!')
        },
        onSuccess,
        onError,
    })
}

export default useDeletePRCatering