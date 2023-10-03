import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveDepartment = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`department/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Department')
            }else{
                const res = await http.post('department', formData)
                success('Success Add Department')
            }
        },
        onSuccess,
    })
}

export default useSaveDepartment