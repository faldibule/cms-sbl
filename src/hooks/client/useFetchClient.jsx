import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchClient = (params) => {
    return useQuery(['clients', params], async ({ signal }) => {
        try {
            const res = await http.get('client', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
        }
    })
}

export default useFetchClient