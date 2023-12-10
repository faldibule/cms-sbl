import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchPRCustomerById = (id, config) => {
    return useQuery(['pr-customer', id], async ({ signal }) => {
        try {
            const res = await http.get(`pr-customer/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0,
        ...config,
    })
}

export default useFetchPRCustomerById