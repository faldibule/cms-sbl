import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveSupplier = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`supplier/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Supplier')
            }else{
                const res = await http.post('supplier', formData)
                success('Success Add Supplier')
            }
        },
        onSuccess,
    })
}

export default useSaveSupplier