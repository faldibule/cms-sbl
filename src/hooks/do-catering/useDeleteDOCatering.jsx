import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteDOCatering = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`catering-do/${id}`)
            success('Success Delete DO Catering!')
        },
        onSuccess,
    })
}

export default useDeleteDOCatering