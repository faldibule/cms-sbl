import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchMealSheetMonthly = (params) => {
    return useQuery(['meal-sheet-monthlies', params], async ({ signal }) => {
        try {
            const res = await http.get('meal-sheet/monthly', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchMealSheetMonthly