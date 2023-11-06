import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchItemProductById = (id) => {
    return useQuery(['item-product', id], async ({ signal }) => {
        const res = await http.get(`item-product/${id}`, {
            signal,
        })
        return res.data.data
    }, {
        cacheTime: 0
    })
}

export default useFetchItemProductById