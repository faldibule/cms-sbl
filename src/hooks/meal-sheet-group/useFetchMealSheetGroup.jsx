import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchMealSheetGroup = (params) => {
    return useQuery(['meal-sheet-groups', params], async ({ signal }) => {
        try {
            const res = await http.get('meal-sheet/group', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    })
}

export default useFetchMealSheetGroup