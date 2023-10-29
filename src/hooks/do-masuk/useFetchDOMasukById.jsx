import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchDOMasukById = (id) => {
    return useQuery(['incoming-do', id], async ({ signal }) => {
        try {
            const res = await http.get(`incoming-do/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchDOMasukById