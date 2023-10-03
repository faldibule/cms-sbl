import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchRole = (params) => {
    return useQuery(['roles', params], async ({ signal }) => {
        try {
            const res = await http.get('user/role', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchRole