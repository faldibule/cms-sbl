import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchCostCenter = (params) => {
    return useQuery(['cost-scenters', params], async ({ signal }) => {
        const res = await http.get('cost-center', {
            signal,
            params
        })
        return res.data.data
    })
}

export default useFetchCostCenter