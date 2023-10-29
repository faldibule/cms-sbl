import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import Loading from '@components/Loading'
import useFetchPOQuotationById from '@hooks/po-quotation/useFetchPOQuotationById'
import { useParams } from 'react-router-dom'

const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchPOQuotationById(id)
    return (
      <Page title='Form Edit PO Keluar Quotation'>
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