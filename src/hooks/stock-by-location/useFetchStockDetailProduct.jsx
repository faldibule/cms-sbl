import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchStockDetailProduct = (params) => {
    return useQuery(['stock-by-location', params], async ({ signal }) => {
        try {
            const res = await http.get('product_stock/show', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchStockDetailProduct