import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchFormulaById = (id) => {
    return useQuery(['formula', id], async () => {
        try {
            const res = await http.get(`formula/${id}`)   
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchFormulaById