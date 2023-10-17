import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePOMasuk = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`incoming-po/${id}`)
            success('Success Delete PO Masuk!')
        },
        onSuccess,
    })
}

export default useDeletePOMasuk