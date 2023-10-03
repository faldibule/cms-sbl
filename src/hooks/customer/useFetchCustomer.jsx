import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchCustomer = (params) => {
    return useQuery(['customers', params], async ({ signal }) => {
        try {
            const res = await http.get('customer', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchCustomer