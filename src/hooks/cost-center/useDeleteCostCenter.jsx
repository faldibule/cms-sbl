import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteCostCenter = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`cost-center/${id}`)
            success('Success Delete Cost Center!')
        },
        onSuccess,
    })
}

export default useDeleteCostCenter