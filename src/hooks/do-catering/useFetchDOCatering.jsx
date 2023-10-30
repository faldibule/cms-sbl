import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchDOCatering = (params) => {
    return useQuery(['do-caterings', params], async ({ signal }) => {
        try {
            const res = await http.get('catering-do', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchDOCatering