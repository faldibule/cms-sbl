import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import Loading from '@components/Loading'
import { useParams } from 'react-router-dom'
import useFetchDOMasukById from '@hooks/do-masuk/useFetchDOMasukById'

const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchDOMasukById(id)
    return (
      <Page title='Form Edit DO Masuk'>
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