import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveMealSheetDaily = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`meal-sheet/daily/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Meal Sheet Daily!')
            }else{
                const res = await http.post('meal-sheet/daily', formData)
                success('Success Add Meal Sheet Daily!')
            }
        },
        onSuccess,
    })
}

export default useSaveMealSheetDaily