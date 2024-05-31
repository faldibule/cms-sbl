import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveMealRate = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.patch(`meal-rate/${id}`, {} , {
                    params: {
                       ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Meal Rate!')
            }else{
                const res = await http.post('meal-rate', formData)
                success('Success Add Meal Rate')
            }
            navigate('/master-data/meal-rate')
        },
        onSuccess,
    })
}

export default useSaveMealRate