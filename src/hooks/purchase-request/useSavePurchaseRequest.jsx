import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSavePurchaseRequest = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`purchase-request/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Purchase Request')
            }else{
                res = await http.post('purchase-request', formData)
                success('Success Add Purchase Request')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/purchase_request`)
        },
        onSuccess,
    })
}

export default useSavePurchaseRequest