import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchPOSupplierCustomerById from '@hooks/po-supplier-customer/useFetchPOSupplierCustomerById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchPOSupplierCustomerById(id)

    if(!isLoading && !data){
      return 'Data PO Supplier Customer Tidak Ditemukan'
    }

    return (
      <Page title='Form Edit PO Supplier Customer'>
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