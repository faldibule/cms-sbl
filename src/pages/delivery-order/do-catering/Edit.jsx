import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import Loading from '@components/Loading'
import { useParams } from 'react-router-dom'
import useFetchDOCateringById from '@hooks/do-catering/useFetchDOCateringById'

const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchDOCateringById(id)
    return (
      <Page title='Form Edit DO Catering'>
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