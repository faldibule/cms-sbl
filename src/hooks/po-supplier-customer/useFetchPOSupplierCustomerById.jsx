import http from '@variable/Api'
import { useQuery } from 'react-query'

const useFetchPOSupplierCustomerById = (id, config = {}) => {
    return useQuery(['po-supplier-customer', id], async ({ signal }) => {
        try {
            const res = await http.get(`po-supplier-customer/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0, 
        ...config,
    })
}

export default useFetchPOSupplierCustomerById