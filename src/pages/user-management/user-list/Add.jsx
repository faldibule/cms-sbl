import Page from '@components/Page'
import { Container, Stack, Typography } from '@mui/material'
import React from 'react'
import Form from './Form'

const Add = () => {
    return (
        <Page title='Add User List'>
            <Container>
                <Typography variant='h4' mb={3}>Add User List</Typography>
                <Form title='add' />
            </Container>
        </Page>
    )
}

export default Add