import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchHistory = (params) => {
    return useQuery(['histories', params], async ({ signal }) => {
        try {
            const res = await http.get('order-history', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchHistory