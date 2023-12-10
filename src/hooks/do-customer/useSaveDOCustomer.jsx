import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveDOCustomer = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`do-customer/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit DO Customer!')
            }else{
                res = await http.post('do-customer', formData)
                success('Success Add DO Customer!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/do_customer`)
        },
        onSuccess,
    })
}

export default useSaveDOCustomer