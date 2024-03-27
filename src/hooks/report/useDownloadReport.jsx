import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDownloadReport = ({ onSuccess, onError }) => {
    const { failed } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (params) => {
            const res = await http.get(params.report_type, {
                responseType: 'blob',
                params,
            })
            return { 
                params,
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

export default useDownloadReport