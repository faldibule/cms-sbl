import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPOCustomer = (params) => {
    return useQuery(['po-customers', params], async ({ signal }) => {
        try {
            const res = await http.get('po-customer', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPOCustomer