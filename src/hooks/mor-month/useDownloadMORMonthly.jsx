import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDownloadMORMonthly = ({ onSuccess, onError }) => {
    const { failed } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (params) => {
            const res = await http.get(`mor/export`, {
                responseType: 'blob',
                params,
            })
            return { 
                data: res.data, 
            }
        },
        onSuccess,
        onError: (err) => {
            failed('Something went Wrong!')
            return err
        }
    })
}

export default useDownloadMORMonthly