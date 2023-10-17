import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveUser = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id, title }) => {
            if(title === 'add') {
                const res = await http.post('user', formData) 
                success('Success Create User')
                return res.data
            }
            if(title === 'edit'){
                const res = await http.post(`user/${id}`, formData)
                success('Success Edit User')
                return {
                    form: Object.fromEntries(formData),
                    response: res.data
                }
            }
        },
        onSuccess,
    })
}

export default useSaveUser