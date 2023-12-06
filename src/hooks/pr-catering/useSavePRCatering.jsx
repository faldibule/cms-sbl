import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSavePRCatering = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`pr-catering/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit PR Catering!')
            }else{
                res = await http.post('pr-catering', formData)
                success('Success Add PR Catering!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/pr_catering`)
        },
        onSuccess,
    })
}

export default useSavePRCatering