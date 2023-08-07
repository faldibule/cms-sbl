import React from 'react'
import Page from '../../../components/Page'
import { Container } from '@mui/material'
import Form from './Form'

const Edit = () => {
  return (
    <Page title='Terima Purchase Order Customer'>
        <Container>
            <Form title='edit' type='input' data={{ a: '' }} />
        </Container>
    </Page>
  )
}

export default Edit