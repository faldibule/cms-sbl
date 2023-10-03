import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveCategory = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`item-category/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Category')
            }else{
                const res = await http.post('item-category', formData)
                success('Success Add Category')
            }
        },
        onSuccess,
    })
}

export default useSaveCategory