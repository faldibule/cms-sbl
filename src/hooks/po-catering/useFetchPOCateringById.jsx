import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchPOCateringById = (id, config) => {
    return useQuery(['po-catering', id], async ({ signal }) => {
        try {
            const res = await http.get(`po-catering/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0,
        ...config
    })
}

export default useFetchPOCateringById