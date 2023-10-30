import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import Loading from '@components/Loading'
import useFetchDOFoodById from '@hooks/do-food/useFetchDOFoodById'
import { useParams } from 'react-router-dom'

const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchDOFoodById(id)
    return (
      <Page title='Form Edit DO Keluar Food Supply'>
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