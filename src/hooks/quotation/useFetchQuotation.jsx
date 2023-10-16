import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchQuotation = (params) => {
    return useQuery(['quotations', params], async ({ signal }) => {
        try {
            const res = await http.get('quotation', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchQuotation