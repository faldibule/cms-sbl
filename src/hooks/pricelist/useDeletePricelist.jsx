import useCustomSnackbar from '@hooks/useCustomSnackbar'
import http from '@variable/Api'
import { useMutation } from 'react-query'

const useDeletePricelist = ({ onSuccess }) => {
    const { success } = useCustomSnackbar()
    return useMutation({
        mutationFn: async (id) => {
            const res = await http.delete(`price-list/${id}`)
            success('Success Delete Pricelist!')
        },
        onSuccess,
    })
}

export default useDeletePricelist