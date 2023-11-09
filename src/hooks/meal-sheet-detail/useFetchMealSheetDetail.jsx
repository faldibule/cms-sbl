import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchMealSheetDetail = (params) => {
    return useQuery(['meal-sheet-details', params], async ({ signal }) => {
        try {
            const res = await http.get('meal-sheet/daily-record', {
                signal,
                params
            })
            return res.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchMealSheetDetail