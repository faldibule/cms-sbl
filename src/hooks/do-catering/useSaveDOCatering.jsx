import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveDOCatering = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`catering-do/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit DO Catering!')
            }else{
                res = await http.post('catering-do', formData)
                success('Success Add DO Catering!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/catering_do`)
        },
        onSuccess,
    })
}

export default useSaveDOCatering