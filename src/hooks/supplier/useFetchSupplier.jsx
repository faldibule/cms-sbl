import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchSupplier = (params) => {
    return useQuery(['suppliers', params], async ({ signal }) => {
        try {
            const res = await http.get('supplier', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchSupplier