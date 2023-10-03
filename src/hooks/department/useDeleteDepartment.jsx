import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteDepartment = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`department/${id}`)
            success('Success Delete Department!')
        },
        onSuccess,
    })
}

export default useDeleteDepartment