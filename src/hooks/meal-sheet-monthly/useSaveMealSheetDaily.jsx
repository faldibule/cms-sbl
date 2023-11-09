import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveMealSheetMonthly = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            const res = await http.post('meal-sheet/monthly/upsert', formData)
            success('Success !')
        },
        onSuccess,
    })
}

export default useSaveMealSheetMonthly