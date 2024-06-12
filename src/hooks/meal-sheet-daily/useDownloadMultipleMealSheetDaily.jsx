import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDownloadMultipleMealSheetDaily = ({ onSuccess, onError }) => {
    const { failed } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (data) => {
            const res = await http.post('meal-sheet/daily/meal_sheet_pdf/multiple', data, {
                responseType: 'blob',
            })
            return { 
                data: res.data, 
            }
        },
        onSuccess,
        onError: (err) => {
            failed('Something went Wrong!')
            return err
        }
    })
}

export default useDownloadMultipleMealSheetDaily