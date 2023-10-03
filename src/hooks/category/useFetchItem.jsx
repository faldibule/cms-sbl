import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchCategory = (params) => {
    return useQuery(['categories', params], async ({ signal }) => {
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

export default useFetchCategory