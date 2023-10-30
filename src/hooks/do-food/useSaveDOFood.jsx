import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveDOFood = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`outgoing-do/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit DO Keluar Food Supply!')
            }else{
                res = await http.post('outgoing-do', formData)
                success('Success Add DO Keluar Food Supply!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/outgoing_do`)
        },
        onSuccess,
    })
}

export default useSaveDOFood