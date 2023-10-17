import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import useFetchPOMasukById from '@hooks/po-masuk/useFetchPOMasukById'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'

const Add = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchPOMasukById(id)
  return (
    <Page title='Form Edit PO Masuk'>
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