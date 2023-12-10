import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveQuotation = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`quotation/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Quotation')
            }else{
                res = await http.post('quotation', formData)
                success('Success Add Quotation')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/quotation`)
        },
        onSuccess,
    })
}

export default useSaveQuotation