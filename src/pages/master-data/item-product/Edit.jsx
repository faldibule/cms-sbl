import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchItemProductById from '@hooks/item-product/useFetchItemProductById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchItemProductById(id)

  if(!isLoading && !data){
    return 'Data Product Tidak Ditemukan'
  }

  return (
    <Page title='Form Edit Item Product'>
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