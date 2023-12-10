import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchPOCustomerById = (id, config) => {
    return useQuery(['po-customer', id], async ({ signal }) => {
        try {
            const res = await http.get(`po-customer/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0,
        ...config,
    })
}

export default useFetchPOCustomerById