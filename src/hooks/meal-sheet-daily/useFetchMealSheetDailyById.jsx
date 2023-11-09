import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchMealSheetDailyById = (id) => {
    return useQuery(['meal-sheet-dailiy', id], async ({ signal }) => {
        try {
            const res = await http.get(`meal-sheet/daily/${id}`)
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchMealSheetDailyById