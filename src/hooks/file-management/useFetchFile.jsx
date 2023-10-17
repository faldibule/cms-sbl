import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchFile = (params) => {
    return useQuery(['files', params], async ({ signal }) => {
        try {
            const res = await http.get('file', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchFile