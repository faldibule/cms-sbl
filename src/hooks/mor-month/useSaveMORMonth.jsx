import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveMORMonth = ({ onSuccess }) => {
    const { success, failed } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post('mor-month/upsert', formData)
            success('Success Submit MOR Month !')
        },
        onSuccess,
        onError: (err) => {
            failed('Something Went Wrong!')
            return err
        }
    })
}

export default useSaveMORMonth