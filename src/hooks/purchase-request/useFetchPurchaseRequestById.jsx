import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPurchaseRequestById = (id, config) => {
    return useQuery(['purchase-request', id], async ({ signal }) => {
        try {
            const res = await http.get(`purchase-request/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0,
        ...config,
    })
}

export default useFetchPurchaseRequestById