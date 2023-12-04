import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchDOCateringById = (id) => {
    return useQuery(['do-catering', id], async ({ signal }) => {
        try {
            const res = await http.get(`do-catering/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchDOCateringById