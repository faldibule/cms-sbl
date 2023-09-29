import React from 'react'
import Page from '../../../components/Page'
import { Container } from '@mui/material'
import Form from './Form'

const Add = () => {
  return (
    <Page title='Form Edit PO Keluar Quotation'>
        <Container>
            <Form type='input' title='edit' data={{data: ''}} />
        </Container>
    </Page>
  )
}

export default Add