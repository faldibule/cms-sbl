import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'
import { useParams } from 'react-router-dom'
import useFetchFile from '@hooks/file-management/useFetchFile'
import Loading from '@components/Loading'

const Add = () => {
    const { id, reference_type } = useParams()
    const { data, refetch, isLoading } = useFetchFile({ 
        reference_type,
        reference_id: id,
        type: 'attachment',
        paginate: 0,
    })
    return (
      <Page title='File Upload'>
          <Container>
              {!isLoading ?
                <Form reference_type={reference_type} data={data.data} id={id} refetch={refetch} />
              : <Loading />
              }
          </Container>
      </Page>
    )
}

export default Add