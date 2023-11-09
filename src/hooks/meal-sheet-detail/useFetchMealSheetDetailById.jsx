import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchMealSheetDetailById = (id) => {
    return useQuery(['meal-sheet-detail', id], async ({ signal }) => {
        try {
            const res = await http.get(`meal-sheet/daily-record/${id}`)
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchMealSheetDetailById