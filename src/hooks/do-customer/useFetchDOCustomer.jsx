import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchDOCustomer = (params) => {
    return useQuery(['do-customers', params], async ({ signal }) => {
        try {
            const res = await http.get('do-customer', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchDOCustomer