import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPOCateringById = (id) => {
    return useQuery(['po-catering', id], async ({ signal }) => {
        try {
            const res = await http.get(`catering-po/${id}`)
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchPOCateringById