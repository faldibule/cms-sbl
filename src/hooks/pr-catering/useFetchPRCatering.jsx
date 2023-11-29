import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchPRCatering = (params) => {
    return useQuery(['pr-caterings', params], async ({ signal }) => {
        try {
            const res = await http.get('pr-catering', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPRCatering