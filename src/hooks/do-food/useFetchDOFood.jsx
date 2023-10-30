import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchDOFood = (params) => {
    return useQuery(['do-foods', params], async ({ signal }) => {
        try {
            const res = await http.get('outgoing-do', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchDOFood