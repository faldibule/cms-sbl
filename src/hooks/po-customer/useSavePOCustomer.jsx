import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSavePOCustomer = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`po-customer/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit PO Customer!')
            }else{
                res = await http.post('po-customer', formData)
                success('Success Add PO Customer!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/po_customer`)
        },
        onSuccess,
    })
}

export default useSavePOCustomer