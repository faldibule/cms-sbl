import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchPOSupplierCateringById from '@hooks/po-supplier-catering/useFetchPOSupplierCateringById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchPOSupplierCateringById(id)

    if(!isLoading && !data){
      return 'Data PO Supplier Catering Tidak Ditemukan'
    }

    return (
      <Page title='Form Edit PO Supplier Catering'>
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