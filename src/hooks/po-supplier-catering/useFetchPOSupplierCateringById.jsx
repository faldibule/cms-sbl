import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchPOSupplierCateringById = (id) => {
    return useQuery(['po-supplier-catering', id], async ({ signal }) => {
        try {
            const res = await http.get(`po-supplier-catering/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchPOSupplierCateringById