import http from '@variable/Api'
import useCustomSnackbar from '@hooks/useCustomSnackbar'
import { useMutation } from 'react-query'

const useShowFile = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (value) => {
            const res = await http.get(`file/show`, {
                responseType: 'blob',
                params: {
                    path: value.file
                }
            })
            return { 
                data: res.data, 
                value, 
            }
        },
        onSuccess,
    })
}

export default useShowFile