import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useSaveLocation = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`location/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Location')
            }else{
                const res = await http.post('location', formData)
                success('Success Add Location')
            }
        },
        onSuccess,
    })
}

export default useSaveLocation