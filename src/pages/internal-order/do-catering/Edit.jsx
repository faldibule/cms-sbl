import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import Loading from '@components/Loading'
import { useParams } from 'react-router-dom'
import useFetchDOCateringById from '@hooks/do-catering/useFetchDOCateringById'
const temp = {
  data: undefined,
  isLoading: false
}
const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = temp
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