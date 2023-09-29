import React from 'react'
import Page from '../../../components/Page'
import { Container } from '@mui/material'
import Form from './Form'

const Add = () => {
  return (
    <Page title='Input PO Catering'>
        <Container>
            <Form title='add' type='input' />
        </Container>
    </Page>
  )
}

export default Add