import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchLocation = (params) => {
    return useQuery(['locations', params], async ({ signal }) => {
        try {
            const res = await http.get('location', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchLocation