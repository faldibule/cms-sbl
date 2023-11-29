import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchPRCateringById from '@hooks/pr-catering/useFetchPRCateringById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchPRCateringById(id)

  if(!isLoading && !data){
    return 'Data PR Catering Tidak Ditemukan'
  }

  return (
    <Page title='Form Edit PR Catering'>
        <Container>
            {!isLoading ?
              <Form title='edit' data={data} id={id} />
            : <Loading />
            }
        </Container>
    </Page>
  )
}

export default Edit