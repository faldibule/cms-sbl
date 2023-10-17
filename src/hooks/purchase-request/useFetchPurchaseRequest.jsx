import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPurchaseRequest = (params) => {
    return useQuery(['purchase-requests', params], async ({ signal }) => {
        try {
            const res = await http.get('purchase-request', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPurchaseRequest