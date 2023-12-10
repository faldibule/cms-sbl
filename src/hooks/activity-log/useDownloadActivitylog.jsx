import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDownloadActivitylog = ({ onSuccess }) => {
    return useMutation({
        mutationFn: async (params) => {
            const res = await http.get(`activity-log`, {
                responseType: 'blob',
                params,
            })
            return { 
                data: res.data, 
            }
        },
        onSuccess,
    })
}

export default useDownloadActivitylog