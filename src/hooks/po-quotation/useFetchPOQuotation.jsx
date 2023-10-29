import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPOQuotation = (params) => {
    return useQuery(['po-quotations', params], async ({ signal }) => {
        try {
            const res = await http.get('outgoing-po', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPOQuotation