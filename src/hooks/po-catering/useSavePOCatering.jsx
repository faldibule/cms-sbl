import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSavePOCatering = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`catering-po/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit PO Catering!')
            }else{
                res = await http.post('catering-po', formData)
                success('Success Add PO Catering!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/catering_po`)
        },
        onSuccess,
    })
}

export default useSavePOCatering