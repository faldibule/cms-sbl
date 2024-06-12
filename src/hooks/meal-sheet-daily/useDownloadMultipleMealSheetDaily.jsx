import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDownloadMultipleMealSheetDaily = ({ onSuccess, onError }) => {
    const { failed } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (data) => {
            const res = await http.get('meal-sheet/daily/meal_sheet_pdf/multiple', {
                params: {
                    meal_sheet_daily_id: data
                },
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
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