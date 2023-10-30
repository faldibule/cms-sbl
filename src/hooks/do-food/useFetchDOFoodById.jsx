import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchDOFoodById = (id) => {
    return useQuery(['do-food', id], async ({ signal }) => {
        try {
            const res = await http.get(`outgoing-do/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchDOFoodById