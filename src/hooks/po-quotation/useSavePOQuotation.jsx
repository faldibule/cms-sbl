import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSavePOQuotation = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`outgoing-po/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit PO Keluar Quotation!')
            }else{
                res = await http.post('outgoing-po', formData)
                success('Success Add PO Keluar Quotation!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/outgoing_po`)
        },
        onSuccess,
    })
}

export default useSavePOQuotation