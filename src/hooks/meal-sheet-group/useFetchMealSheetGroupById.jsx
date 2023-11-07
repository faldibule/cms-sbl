import http from '@variable/Api'
import React from 'react'
import { useQuery } from 'react-query'

const useFetchMealSheetGroupById = (id) => {
    return useQuery(['meal-sheet-group', id], async ({ signal }) => {
        try {
            const res = await http.get(`meal-sheet/group/${id}`)
            return res.data.data
        } catch (err) {
        }
    }, {
        cacheTime: 0
    })
}

export default useFetchMealSheetGroupById