import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchSalesById from '@hooks/sales/useFetchSalesById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchSalesById(id)

  if(!isLoading && !data){
    return 'Data Sales Tidak Ditemukan'
  }

  return (
    <Page title='Form Edit Sales'>
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