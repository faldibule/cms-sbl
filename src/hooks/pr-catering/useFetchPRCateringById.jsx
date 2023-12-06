import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchPRCateringById = (id, config) => {
    return useQuery(['pr-catering', id], async ({ signal }) => {
        try {
            const res = await http.get(`pr-catering/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0,
        ...config,
    })
}

export default useFetchPRCateringById