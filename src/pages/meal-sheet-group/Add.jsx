import React from 'react'
import Page from '@components/Page'
import { Container } from '@mui/material'
import Form from './Form'

const Add = () => {
  return (
    <Page title='Form Input Meal Sheet Group'>
        <Container>
            <Form title='add' />
        </Container>
    </Page>
  )
}

export default Add