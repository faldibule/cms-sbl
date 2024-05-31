import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchFormulaById from '@hooks/formula/useFetchFormulaById'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchFormulaById(id)

  if(!isLoading && !data){
    return 'Data Formula Tidak Ditemukan'
  }

  return (
    <Page title='Form Edit Formula'>
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