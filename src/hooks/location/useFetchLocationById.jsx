import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchLocationById = (id, config = {}) => {
    return useQuery(['location', id], async ({ signal }) => {
        try {
            const res = await http.get(`location/${id}`)
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0,
        ...config
    })
}

export default useFetchLocationById