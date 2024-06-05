import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveSales = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post('sales', formData)
            success('Success Save Sales Report!')
            navigate('/report/sales')
        },
        onSuccess,
    })
}

export default useSaveSales