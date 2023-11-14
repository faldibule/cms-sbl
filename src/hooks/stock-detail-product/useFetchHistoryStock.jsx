import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchHistoryStock = (params, config) => {
    return useQuery(['history-product', params], async ({ signal }) => {
        try {
            const res = await http.get(`product_stock/${params?.id}/history`, {
                params,
                signal,
            })
            return res.data.data
        } catch (err) {
        }
    },
        {
            ...config, 
        }
    )
}

export default useFetchHistoryStock