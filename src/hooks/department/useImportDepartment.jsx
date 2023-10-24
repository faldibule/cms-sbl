import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useImportDepartment = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            const res = await http.post('department/import', formData)
            success('Success Import Department!')
        },
        onSuccess,
    })
}

export default useImportDepartment