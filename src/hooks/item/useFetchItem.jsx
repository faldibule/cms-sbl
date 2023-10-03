import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchItem = (params) => {
    return useQuery(['items', params], async ({ signal }) => {
        try {
            const res = await http.get('item-category', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchItem