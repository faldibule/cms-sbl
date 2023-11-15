import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveMOR = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post('mor/upsert', formData)
            success('Success Submit MOR !')
        },
        onSuccess,
    })
}

export default useSaveMOR