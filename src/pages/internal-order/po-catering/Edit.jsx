import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchPOCateringById from '@hooks/po-catering/useFetchPOCateringById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'
const Edit = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchPOCateringById(id)

    if(!isLoading && !data){
      return 'Data PO Catering Tidak Ditemukan'
    }

    return (
      <Page title='Form Edit PO Catering'>
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