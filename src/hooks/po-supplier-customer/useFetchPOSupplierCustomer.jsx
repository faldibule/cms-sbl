import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPOSupplierCustomer = (params) => {
    return useQuery(['po-supplier-customers', params], async ({ signal }) => {
        try {
            const res = await http.get('po-supplier-customer', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPOSupplierCustomer