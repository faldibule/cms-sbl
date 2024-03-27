import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchMICSMonthlyById = (params, config = {}) => {
    return useQuery(['mor-monthly', params], async ({ signal }) => {
        try {
            const res = await http.get(`mor-month/${params?.id}`, {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchMICSMonthlyById