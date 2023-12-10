import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchPRCustomerById from '@hooks/pr-customer/useFetchPRCustomerById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Add = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchPRCustomerById(id)

  if(!isLoading && !data){
    return 'Data PR Customer Tidak Ditemukan'
  }

  return (
    <Page title='Form Edit PR Customer'>
        <Container>
            {!isLoading ?
              <Form title='edit' data={data} id={id} />
            : <Loading />
            }
        </Container>
    </Page>
  )
}

export default Add