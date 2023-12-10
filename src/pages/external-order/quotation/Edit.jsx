import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchQuotationById from '@hooks/quotation/useFetchQuotationById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchQuotationById(id)

  if(!isLoading && !data){
    return 'Data Quotation Tidak Ditemukan'
  }
  return (
    <Page title='Form Edit Quotation'>
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