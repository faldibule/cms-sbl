import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchMealRateById from '@hooks/meal-rate/useFetchMealRateById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchMealRateById(id)

  if(!isLoading && !data){
    return 'Data Meal Rate Tidak Ditemukan'
  }

  return (
    <Page title='Form Edit Meal Rate'>
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