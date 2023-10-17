import Page from '@components/Page'
import { Container, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Form from './Form'
import { useParams } from 'react-router-dom'
import Loading from '@components/Loading'
import { useQuery } from 'react-query'
import http from '@variable/Api'
import useFetchUserById from '@hooks/user-list/useFetchUserById'
import useShowFile from '@hooks/file-management/useShowFile'

const Edit = () => {
    const { id } = useParams()
    const { data, isLoading, refetch } = useFetchUserById(id)
    const [loading, setLoading] = useState(true)
    const { mutate: getProfilePicture, isLoading: loadingProfilePicture } = useShowFile({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            localStorage.setItem("profile_user_by_id", temp);
            setLoading(false)
        }
    })

    useEffect(() => {
        let mounted = true
        if(!mounted) return 
        if(isLoading) return
        if(!!!data?.photo){
            setLoading(false)
        }else{
            getProfilePicture({ file: data.photo })
        } 
        
        return () => mounted = false
    }, [id, data, isLoading])

    return (
        <Page title='Edit User List'>
            <Container>
                <Typography variant='h4' mb={3}>Edit User List</Typography>
                {!loading ?
                    <Form title='edit' data={data} id={id} />
                    : <Loading />
                }
            </Container>
        </Page>
    )
}

export default Edit