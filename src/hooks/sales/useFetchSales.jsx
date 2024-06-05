import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchSales = (params) => {
    return useQuery(['sales', params], async ({ signal }) => {
        try {
            const res = await http.get('sales', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    })
}

export default useFetchSales