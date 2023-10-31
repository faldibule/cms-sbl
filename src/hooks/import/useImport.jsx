import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useImport = ({ onSuccess, onError }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, url = '', title }) => {
            const res = await http.post(url, formData)
            success(`Success Import ${title}!`)
            return res.data
        },
        onSuccess,
        onError,
    })
}

export default useImport