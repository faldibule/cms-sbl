import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchQuotationById = (id, config) => {
    return useQuery(['quotation', id], async ({ signal }) => {
        try {
            const res = await http.get(`quotation/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0,
        ...config,
    })
}

export default useFetchQuotationById