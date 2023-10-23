import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPOCatering = (params) => {
    return useQuery(['po-caterings', params], async ({ signal }) => {
        try {
            const res = await http.get('catering-po', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchPOCatering