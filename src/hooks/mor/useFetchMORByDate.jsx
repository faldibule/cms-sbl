import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchMORByDate = (params) => {
    return useQuery(['mor-by-date', params], async ({ signal }) => {
        try {
            const res = await http.get('mor', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    })
}

export default useFetchMORByDate