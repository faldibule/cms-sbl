import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeleteMealSheetGroup = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`meal-sheet/group/${id}`)
            success('Success Delete Meal Sheet Group!')
        },
        onSuccess,
    })
}

export default useDeleteMealSheetGroup