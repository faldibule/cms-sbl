import Page from '@components/Page'
import { Container, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Form from './Form'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'

const Add = () => {
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const [data, setData] = useState()
    const getData = () => new Promise(resolve => setTimeout(() => {
        resolve('done')
        setData({
            employee_code: '12321',
            email: 'test@gmail.com',
            status: '1',
        })
    }, 500))
    useEffect(() => {
        getData().then(v => setLoading(false))
    }, [id])

    if(loading) return <Loading />

    return (
        <Page title='Edit User List'>
            <Container>
                <Typography variant='h4' mb={3}>Edit User List</Typography>
                <Form title='Edit' data={data} />
            </Container>
        </Page>
    )
}

export default Add