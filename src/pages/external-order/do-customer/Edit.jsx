import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchDOCustomerById from '@hooks/do-customer/useFetchDOCustomerById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchDOCustomerById(id)

    if(!isLoading && !data){
      return 'Data DO Customer Tidak Ditemukan'
    }

    return (
      <Page title='Form Edit DO Customer'>
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