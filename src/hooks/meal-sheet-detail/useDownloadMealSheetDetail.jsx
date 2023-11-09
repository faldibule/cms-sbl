import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDownloadMealSheetDetail = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.post(`meal-sheet/daily-record/${id}/daily-meal-sheet-pdf`, {}, {
                responseType: 'blob',
            })
            success('Success Download Meal Sheet Detail!')
            return res
        },
        onSuccess,
    })
}

export default useDownloadMealSheetDetail