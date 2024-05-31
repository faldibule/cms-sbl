import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteMealRate = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`meal-rate/${id}`)
            success('Success Delete Meal Rate!')
        },
        onSuccess,
    })
}

export default useDeleteMealRate