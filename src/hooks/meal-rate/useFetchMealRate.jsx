import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchMealRate = (params) => {
    return useQuery(['meal-rates', params], async ({ signal }) => {
        try {
            const res = await http.get('meal-rate', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    })
}

export default useFetchMealRate