import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'
import useFetchMealSheetDetailById from '@hooks/meal-sheet-detail/useFetchMealSheetDetailById'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchMealSheetDetailById(id)
  return (
    <Page title='Form Edit Meal Sheet Detail'>
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