import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchMealSheetDaily = (params) => {
    return useQuery(['meal-sheet-dailies', params], async ({ signal }) => {
        try {
            const res = await http.get('meal-sheet/daily', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchMealSheetDaily