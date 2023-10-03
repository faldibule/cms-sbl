import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveCostCenter = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`cost-center/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Cost Center')
            }else{
                const res = await http.post('cost-center', formData)
                success('Success Add Cost Center')
            }
        },
        onSuccess,
    })
}

export default useSaveCostCenter