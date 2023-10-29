import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteDOMasuk = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`incoming-do/${id}`)
            success('Success Delete DO Masuk!')
        },
        onSuccess,
    })
}

export default useDeleteDOMasuk