import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveMealSheetGroup = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.post(`meal-sheet/group/${id}`, formData)
                success('Success Edit Meal Sheet Group!')
            }else{
                res = await http.post('meal-sheet/group', formData)
                success('Success Add Meal Sheet Group!')
            }
            navigate('/meal-sheet/group')
        },
        onSuccess,
    })
}

export default useSaveMealSheetGroup