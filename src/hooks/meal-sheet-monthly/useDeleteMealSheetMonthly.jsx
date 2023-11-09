import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteMealSheetMonthly = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`meal-sheet/monthly/${id}`)
            success('Success Delete Meal Sheet Monthly!')
        },
        onSuccess,
    })
}

export default useDeleteMealSheetMonthly