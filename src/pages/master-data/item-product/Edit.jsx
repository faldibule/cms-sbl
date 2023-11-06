import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'
import useFetchItemProductById from '@hooks/item-product/useFetchItemProductById'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchItemProductById(id)
  return (
    <Page title='Form Edit Item Product'>
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