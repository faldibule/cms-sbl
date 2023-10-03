import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchDepartment = (params) => {
    return useQuery(['departments', params], async ({ signal }) => {
        try {
            const res = await http.get('department', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchDepartment