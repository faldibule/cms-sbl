import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPOMasukById = (id) => {
    return useQuery(['po-masuk', id], async ({ signal }) => {
        try {
            const res = await http.get(`incoming-po/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchPOMasukById