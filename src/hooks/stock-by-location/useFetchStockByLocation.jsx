import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchStockByLocation = (params) => {
    return useQuery(['stock-by-location', params], async ({ signal }) => {
        try {
            const res = await http.get('product_stock', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    })
}

export default useFetchStockByLocation