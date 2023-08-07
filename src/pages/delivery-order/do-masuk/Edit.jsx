import React from 'react'
import Page from '../../../components/Page'
import { Container } from '@mui/material'
import Form from './Form'

const Edit = () => {
  return (
    <Page title='Form Input Purchase Request'>
        <Container>
            <Form type='input' title='edit' data={{data: ''}} />
        </Container>
    </Page>
  )
}

export default Edit