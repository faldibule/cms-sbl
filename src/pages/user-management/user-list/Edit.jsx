import Page from '@components/Page'
import { Container, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Form from './Form'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'
import { useQuery } from 'react-query'
import http from '@variable/Api'

const Add = () => {
    const { id } = useParams()
    const getUserById = async () => {
        try {
            const res = await http.get(`user/${id}`)   
            return res.data.data
        } catch (err) {
            // console.log(err.response)
        }
    }
    const { data, isLoading } = useQuery(['user', id], () => getUserById())

    return (
        <Page title='Edit User List'>
            <Container>
                <Typography variant='h4' mb={3}>Edit User List</Typography>
                {!isLoading ?
                    <Form title='edit' data={data} id={id} />
                : <Loading />
                }
            </Container>
        </Page>
    )
}

export default Add