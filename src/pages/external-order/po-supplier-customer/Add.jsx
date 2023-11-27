import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'

const Add = () => {
  return (
    <Page title='From Input PO Supplier Customer'>
        <Container>
            <Form title='add' type='input' />
        </Container>
    </Page>
  )
}

export default Add