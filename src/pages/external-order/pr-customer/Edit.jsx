import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'

const Add = () => {
  const { id } = useParams()
  const isLoading = false
  const data = {}
  return (
    <Page title='Form Edit PR Customer'>
        <Container>
            {!isLoading ?
              <Form title='edit' data={data} id={id} />
            : <Loading />
            }
        </Container>
    </Page>
  )
}

export default Add