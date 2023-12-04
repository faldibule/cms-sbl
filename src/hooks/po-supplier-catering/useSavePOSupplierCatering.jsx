import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSavePOSupplierCatering = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`po-supplier-catering/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit PO Supplier Catering!')
            }else{
                res = await http.post('po-supplier-catering', formData)
                success('Success Add PO Supplier Catering!')
            }
            const id_temp = res.data.data.id
            // navigate(`/file/${id_temp}/po-supplier-catering`)
            navigate(`/internal-order/po-supplier-catering`)
        },
        onSuccess,
    })
}

export default useSavePOSupplierCatering