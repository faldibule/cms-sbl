import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDownloadSales = ({ onSuccess, onError }) => {
    const { failed } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData }) => {
            const res = await http.post('export/sales-excel', formData, {
                responseType: 'blob'
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

export default useDownloadSales