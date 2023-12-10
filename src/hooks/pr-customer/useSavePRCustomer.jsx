import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSavePRCustomer = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`pr-customer/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit PR Customer!')
            }else{
                res = await http.post('pr-customer', formData)
                success('Success Add PR Customer!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/pr_customer`)
        },
        onSuccess,
    })
}

export default useSavePRCustomer