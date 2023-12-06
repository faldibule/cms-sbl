import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchDOCateringById from '@hooks/do-catering/useFetchDOCateringById'
import useFetchFile from '@hooks/file-management/useFetchFile'
import useFetchPOCateringById from '@hooks/po-catering/useFetchPOCateringById'
import useFetchPOSupplierCateringById from '@hooks/po-supplier-catering/useFetchPOSupplierCateringById'
import useFetchPRCateringById from '@hooks/pr-catering/useFetchPRCateringById'
import { Container } from '@mui/material'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Form from './Form'

const available = ['pr_catering', 'po_catering', 'po_supplier_catering', 'do_catering']
const Edit = () => {
    const { id, reference_type } = useParams()
    const { data, refetch, isLoading } = useFetchFile({ 
        reference_type,
        reference_id: id,
        type: 'attachment',
        paginate: 0,
    })

    const { data: dataPRCatering, isLoading: loadingPRCatering } = useFetchPRCateringById(id, {
        enabled: reference_type === 'pr_catering'
    })
    const { data: dataPOCatering, isLoading: loadingPOCatering } = useFetchPOCateringById(id, {
        enabled: reference_type === 'po_catering'
    })
    const { data: dataPOSupplierCatering, isLoading: loadingPOSupplierCatering } = useFetchPOSupplierCateringById(id, {
        enabled: reference_type === 'po_supplier_catering'
    })
    const { data: dataDOCatering, isLoading: loadingDOCatering } = useFetchDOCateringById(id, {
        enabled: reference_type === 'do_catering'
    })
    
    const dataParent = useMemo(() => {
       if(reference_type === 'pr_catering') return dataPRCatering
       if(reference_type === 'po_catering') return dataPOCatering
       if(reference_type === 'po_supplier_catering') return dataPOSupplierCatering
       if(reference_type === 'do_catering') return dataDOCatering
    }, [dataPRCatering, dataPOCatering, dataPOSupplierCatering, dataDOCatering])

    if(reference_type === 'pr_catering' && !dataPRCatering && !loadingPRCatering){
        return 'Data PR Catering Tidak ditemukan'
    }
    if(reference_type === 'po_catering' && !dataPOCatering && !loadingPOCatering){
        return 'Data PO Catering Tidak ditemukan'
    }
    if(reference_type === 'po_supplier_catering' && !dataPOSupplierCatering && !loadingPOSupplierCatering){
        return 'Data PO Supplier Catering Tidak ditemukan'
    }
    if(reference_type === 'do_catering' && !dataDOCatering && !loadingDOCatering){
        return 'Data DO Catering Tidak ditemukan'
    }

    if(!available.includes(reference_type)){
        return 'Reference Key Tidak Ditemukan'
    }

    return (
      <Page title='File Upload'>
          <Container>
              { !isLoading && 
                !loadingPRCatering && !loadingPOCatering && !loadingPOSupplierCatering && !loadingDOCatering ?
                <Form dataParent={dataParent} reference_type={reference_type} data={data.data} id={id} refetch={refetch} />
              : <Loading />
              }
          </Container>
      </Page>
    )
}

export default Edit;