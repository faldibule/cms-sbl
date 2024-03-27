import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchMICSMonthly = (params) => {
    return useQuery(['mor-monthly-group', params], async ({ signal }) => {
        try {
            const res = await http.get('mor-month/month-year-group', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    })
}

export default useFetchMICSMonthly