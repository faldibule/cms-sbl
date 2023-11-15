import React, { useMemo } from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import useFetchQuotationById from '@hooks/quotation/useFetchQuotationById'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'
import useFetchMORByDate from '@hooks/mor/useFetchMORByDate'

const Edit = () => {
  const { date, location_id } = useParams()
  const params = useMemo(() => {
    return {
      date,
      location_id,
      paginate: 0
    }
  })
  const { data, isLoading } = useFetchMORByDate(params)
  return (
    <Page title='Form Edit MOR'>
        <Container>
            {!isLoading ?
              <Form title='edit' data={data} />
            : <Loading />
            }
        </Container>
    </Page>
  )
}

export default Edit