import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchMICSDailyByDate from '@hooks/mics-daily/useFetchMICSDailyByDate'
import { Container } from '@mui/material'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Form from './Form'

const Edit = () => {
  const { date, location_id } = useParams()
  const params = useMemo(() => {
    return {
      date,
      location_id,
      paginate: 0
    }
  })
  const { data, isLoading } = useFetchMICSDailyByDate(params)
  return (
    <Page title='Form Edit MOR'>
        <Container>
            {!isLoading ?
              <Form title='edit' data={data} />
            : <Loading />
            }
        </Container>
    </Page>
  )
}

export default Edit