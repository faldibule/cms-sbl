import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchDiscount = (params) => {
    return useQuery(['discounts', params], async ({ signal }) => {
        try {
            const res = await http.get('discount', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchDiscount