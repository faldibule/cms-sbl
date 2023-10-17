import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import useFetchPurchaseRequestById from '@hooks/purchase-request/useFetchPurchaseRequestById'
import { useParams } from 'react-router-dom'

const Add = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchPurchaseRequestById(id)
  return (
    <Page title='Form Edit Purchase Request'>
        <Container>
            {!isLoading ?
              <Form title='edit' data={data} id={id} />
            : null
            }
        </Container>
    </Page>
  )
}

export default Add