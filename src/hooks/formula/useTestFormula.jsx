import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useTestFormula = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post('formula/testing-result', formData)
            success(`Success run code!`)
            return res.data
        },
        onSuccess,
        onError,
    })
}

export default useTestFormula