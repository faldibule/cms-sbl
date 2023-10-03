import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchUser = (params) => {
    return useQuery(['users', params], async ({ signal }) => {
        try {
            const res = await http.get('user', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchUser