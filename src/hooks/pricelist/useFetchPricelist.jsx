import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchPricelist = (params, config = {}) => {
    return useQuery(['price-lists', params], async ({ signal }) => {
        try {
            const res = await http.get('price-list', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }, config)
}

export default useFetchPricelist