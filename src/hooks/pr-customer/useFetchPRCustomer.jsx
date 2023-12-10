import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchPRCustomer = (params) => {
    return useQuery(['pr-customers', params], async ({ signal }) => {
        try {
            const res = await http.get('pr-customer', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPRCustomer