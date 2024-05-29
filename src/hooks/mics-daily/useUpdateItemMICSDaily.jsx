import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useUpdateItemMICSDaily = ({ onSuccess }) => {
    const { success, failed } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            const objFormData = Object.fromEntries(formData) 
            const res = await http.patch(`mor/${id}`, {}, {
                params: {
                    ...objFormData
                }
            })
            success('Success Edit Item !')
            return objFormData
        },
        onSuccess,
        onError: (err) => {
            failed('Something Went Wrong!')
            return err
        }
    })
}

export default useUpdateItemMICSDaily