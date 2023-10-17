import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPOMasuk = (params) => {
    return useQuery(['po-masuks', params], async ({ signal }) => {
        try {
            const res = await http.get('incoming-po', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPOMasuk