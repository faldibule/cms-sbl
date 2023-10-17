import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

const useSavePOMasuk = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ formData, id }) => {
            let res = ''
            if(!!id){
                res = await http.patch(`incoming-po/${id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit PO Masuk!')
            }else{
                res = await http.post('incoming-po', formData)
                success('Success Add PO Masuk!')
            }
            const id_temp = res.data.data.id
            navigate(`/file/${id_temp}/incoming_po`)
        },
        onSuccess,
    })
}

export default useSavePOMasuk