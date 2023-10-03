import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveDiscount = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`discount/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Discount')
            }else{
                const res = await http.post('discount', formData)
                success('Success Add Discount')
            }
        },
        onSuccess,
    })
}

export default useSaveDiscount