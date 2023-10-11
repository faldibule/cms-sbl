import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveResetPassword = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post(`user/reset-password/with-old-password`, formData)
            success('Success Change Password!')
        },
        onSuccess,
    })
}

export default useSaveResetPassword