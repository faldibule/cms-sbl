import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchActivitylog = (params) => {
    return useQuery(['activity-logs', params], async ({ signal }) => {
        try {
            const res = await http.get('activity-log', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchActivitylog