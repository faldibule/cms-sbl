import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPOSupplierCatering = (params) => {
    return useQuery(['po-supplier-caterings', params], async ({ signal }) => {
        try {
            const res = await http.get('po-supplier-catering', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPOSupplierCatering