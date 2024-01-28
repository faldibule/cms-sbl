import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchHistoryById = (id, config) => {
    return useQuery(['history', id], async ({ signal }) => {
        try {
            const res = await http.get(`order-history/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0,
        ...config
    })
}

export default useFetchHistoryById