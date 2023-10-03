import Page from '@components/Page'
import { Container, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Form from './Form'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'
import { useQuery } from 'react-query'
import http from '@variable/Api'
import useFetchUserById from '@hooks/user-list/useFetchUserById'

const Add = () => {
    const { id } = useParams()
    const { data, isLoading, refetch } = useFetchUserById(id)

    return (
        <Page title='Edit User List'>
            <Container>
                <Typography variant='h4' mb={3}>Edit User List</Typography>
                {!isLoading ?
                    <Form title='edit' data={data} id={id} refetch={refetch} />
                : null
                }
            </Container>
        </Page>
    )
}

export default Add