import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveMICSDaily = ({ onSuccess }) => {
    const { success, failed } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post('mor/upsert', formData)
            success('Success Submit MOR !')
        },
        onSuccess,
        onError: (err) => {
            failed('Something Went Wrong!')
            return err
        }
    })
}

export default useSaveMICSDaily