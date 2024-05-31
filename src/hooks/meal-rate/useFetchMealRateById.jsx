import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchMealRateById = (id) => {
    return useQuery(['meal-rate', id], async () => {
        try {
            const res = await http.get(`meal-rate/${id}`)   
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchMealRateById