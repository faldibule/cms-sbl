import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchFormula = (params) => {
    return useQuery(['formulas', params], async ({ signal }) => {
        try {
            const res = await http.get('formula', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    })
}

export default useFetchFormula