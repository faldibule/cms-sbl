import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchMealSheetMonthlyById = (id) => {
    return useQuery(['meal-sheet-monthly', id], async ({ signal }) => {
        try {
            const res = await http.get(`meal-sheet/monthly/${id}`)
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchMealSheetMonthlyById