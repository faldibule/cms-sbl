import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchSalesById = (id) => {
    return useQuery(['sale', id], async () => {
        try {
            const res = await http.get(`sales/${id}`)   
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchSalesById