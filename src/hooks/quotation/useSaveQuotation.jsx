import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveQuotation = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`quotation/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Quotation')
            }else{
                const res = await http.post('quotation', formData)
                success('Success Add Quotation')
            }
            navigate('/quotation')
        },
        onSuccess,
    })
}

export default useSaveQuotation