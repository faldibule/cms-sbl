import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveMealSheetDetail = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.post(`meal-sheet/daily-record/${id}`, formData)
                success('Success Edit Meal Sheet Detail!')
            }else{
                res = await http.post('meal-sheet/daily-record', formData)
                success('Success Add Meal Sheet Detail!')
            }
        },
        onSuccess,
    })
}

export default useSaveMealSheetDetail