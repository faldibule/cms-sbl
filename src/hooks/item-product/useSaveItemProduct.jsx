import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveItemProduct = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`item-product/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Item Product!')
            }else{
                const res = await http.post('item-product', formData)
                success('Success Add Item Product!')
            }
            navigate('/master-data/item-product')
        },
        onSuccess,
    })
}

export default useSaveItemProduct