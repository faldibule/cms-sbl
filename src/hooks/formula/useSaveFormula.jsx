import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveFormula = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            if(!!id){
                const res = await http.post(`formula/${id}`, formData)
                success('Success Edit Formula')
            }else{
                const res = await http.post('formula', formData)
                success('Success Add Formula')
            }
            navigate('/master-data/formula')
        },
        onSuccess,
    })
}

export default useSaveFormula