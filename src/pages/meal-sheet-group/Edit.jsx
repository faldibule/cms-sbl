import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'
import useFetchMealSheetGroupById from '@hooks/meal-sheet-group/useFetchMealSheetGroupById'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchMealSheetGroupById(id)
  return (
    <Page title='Form Edit Meal Sheet Group'>
        <Container>
            {!isLoading ?
              <Form title='edit' data={data} id={id} />
            : <Loading />
            }
        </Container>
    </Page>
  )
}

export default Edit