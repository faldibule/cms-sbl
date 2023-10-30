import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useUpdateStatusDOFood = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async ({ type, status, id, note = null }) => {
            if(type === 'update-status'){
                const res = await http.patch(`outgoing-do/${id}/update-status`, {}, {
                    params: {
                       status,
                       note,
                    }
                })
            }else{
                const res = await http.patch(`outgoing-do/${id}/update-approval-status`, {}, {
                    params: {
                       status,
                    }
                })
            }
            success('Success Update Status DO Keluar Food Supply!')
        },
        onSuccess,
    })
}

export default useUpdateStatusDOFood