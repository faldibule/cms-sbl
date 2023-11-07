import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteMealSheetDaily = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`meal-sheet/daily/${id}`)
            success('Success Delete Meal Sheet Daily!')
        },
        onSuccess,
    })
}

export default useDeleteMealSheetDaily