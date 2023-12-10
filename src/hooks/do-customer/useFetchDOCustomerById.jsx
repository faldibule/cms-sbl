import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchDOCustomerById = (id, config = {}) => {
    return useQuery(['do-customer', id], async ({ signal }) => {
        try {
            const res = await http.get(`do-customer/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0, 
        ...config,
    })
}

export default useFetchDOCustomerById