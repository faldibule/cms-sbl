import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchUnit = (params) => {
    return useQuery(['units', params], async ({ signal }) => {
        try {
            const res = await http.get('param/unit', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchUnit