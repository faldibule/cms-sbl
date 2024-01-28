import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchHistoryById from '@hooks/history/useFetchPOCateringById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Detail = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchHistoryById(id)

  if(!isLoading && !data){
    return 'Data History PR Customer Tidak Ditemukan'
  }

  return (
    <Page title='Detail History PR Customer'>
        <Container>
            {!isLoading ?
              <Form title='Detail' data={data} id={id} />
            : <Loading />
            }
        </Container>
    </Page>
  )
}

export default Detail