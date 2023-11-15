import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchMOR = (params) => {
    return useQuery(['stock-by-mor', params], async ({ signal }) => {
        try {
            const res = await http.get('mor/daily', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    })
}

export default useFetchMOR