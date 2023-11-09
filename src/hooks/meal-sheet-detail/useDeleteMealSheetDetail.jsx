import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteMealSheetDetail = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`meal-sheet/daily-record/${id}`)
            success('Success Delete Meal Sheet Detail!')
        },
        onSuccess,
    })
}

export default useDeleteMealSheetDetail