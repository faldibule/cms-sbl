import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSaveDOMasuk = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`incoming-do/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit DO Masuk!')
            }else{
                res = await http.post('incoming-do', formData)
                success('Success Add DO Masuk!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/incoming_do`)
        },
        onSuccess,
    })
}

export default useSaveDOMasuk