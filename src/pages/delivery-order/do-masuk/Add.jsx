import React from 'react'
import Page from '../../../components/Page'
import { Container } from '@mui/material'
import Form from './Form'

const Add = () => {
  return (
    <Page title='Form Input Delivery Order Masuk'>
        <Container>
            <Form title='add' type='input' />
        </Container>
    </Page>
  )
}

export default Add