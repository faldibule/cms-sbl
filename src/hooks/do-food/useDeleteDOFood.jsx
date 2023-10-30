import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteDOFood = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`outgoing-do/${id}`)
            success('Success Delete DO Keluar Food Supply!')
        },
        onSuccess,
    })
}

export default useDeleteDOFood