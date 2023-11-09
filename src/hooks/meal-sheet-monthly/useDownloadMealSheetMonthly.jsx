import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDownloadMealSheetMonthly = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.post(`meal-sheet/monthly/${id}/monthly-meal-sheet-pdf`, {}, {
                responseType: 'blob',
            })
            success('Success Download Meal Sheet Monthly!')
            return res
        },
        onSuccess,
    })
}

export default useDownloadMealSheetMonthly