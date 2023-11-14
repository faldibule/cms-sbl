import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveHistoryStock = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post('product_stock/upsert', formData)
            success('Success Add Stock Product !')
        },
        onSuccess,
    })
}

export default useSaveHistoryStock