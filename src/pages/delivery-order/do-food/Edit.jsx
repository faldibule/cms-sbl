import React from 'react'
import Page from '../../../components/Page'
import { Container } from '@mui/material'
import Form from './Form'

const Edit = () => {
  return (
    <Page title='Form Edit DO Keluar Food Supply'>
        <Container>
            <Form title='edit' data={{data: ''}} />
        </Container>
    </Page>
  )
}

export default Edit