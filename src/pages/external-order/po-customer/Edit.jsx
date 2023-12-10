import Loading from '@components/Loading'
import Page from '@components/Page'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'
import useFetchPOCustomerById from '@hooks/po-customer/useFetchPOCustomerById'


const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchPOCustomerById(id)

    if(!isLoading && !data){
      return 'Data PO Customer Tidak Ditemukan'
    }

    return (
      <Page title='Form Edit PO Customer'>
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