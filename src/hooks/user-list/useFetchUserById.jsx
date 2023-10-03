import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchUserById = (id) => {
    return useQuery(['user', id], async () => {
        try {
            const res = await http.get(`user/${id}`)   
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchUserById