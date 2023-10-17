import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveFile = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post('file', formData)
            success('Success Upload File')
            return res.data
        },
        onSuccess,
    })
}

export default useSaveFile