import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchDOMasuk = (params) => {
    return useQuery(['incoming-dos', params], async ({ signal }) => {
        try {
            const res = await http.get('incoming-do', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchDOMasuk