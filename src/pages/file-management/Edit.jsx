import Loading from '@components/Loading'
import Page from '@components/Page'
import useFetchDOCateringById from '@hooks/do-catering/useFetchDOCateringById'
import useFetchFile from '@hooks/file-management/useFetchFile'
import useFetchPOCateringById from '@hooks/po-catering/useFetchPOCateringById'
import useFetchPOSupplierCateringById from '@hooks/po-supplier-catering/useFetchPOSupplierCateringById'
import useFetchPRCateringById from '@hooks/pr-catering/useFetchPRCateringById'
import useFetchPRCustomerById from '@hooks/pr-customer/useFetchPRCustomerById'
import useFetchQuotationById from '@hooks/quotation/useFetchQuotationById'
import { Container } from '@mui/material'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Form from './Form'
import useFetchPOCustomerById from '@hooks/po-customer/useFetchPOCustomerById'
import useFetchPOSupplierCustomerById from '@hooks/po-supplier-customer/useFetchPOSupplierCustomerById'
import useFetchDOCustomerById from '@hooks/do-customer/useFetchDOCustomerById'

const available = [
    'pr_catering', 'po_catering', 'po_supplier_catering', 'do_catering',
    'pr_customer', 'quotation', 'po_customer', 'po_supplier_customer', 'do_customer'
]
const Edit = () => {
    const { id, reference_type } = useParams()
    const { data, refetch, isLoading } = useFetchFile({ 
        reference_type,
        reference_id: id,
        type: 'attachment',
        paginate: 0,
    })

    // Internal Order
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

    // External ORder
    const { data: dataPRCustomer, isLoading: loadingPRCustomer } = useFetchPRCustomerById(id, {
        enabled: reference_type === 'pr_customer'
    })
    const { data: dataQuotation, isLoading: loadingQuotation } = useFetchQuotationById(id, {
        enabled: reference_type === 'quotation'
    })
    const { data: dataPOCustomer, isLoading: loadingPOCustomer } = useFetchPOCustomerById(id, {
        enabled: reference_type === 'po_customer'
    })
    const { data: dataPOSupplierCustomer, isLoading: loadingPOSupplierCustomer } = useFetchPOSupplierCustomerById(id, {
        enabled: reference_type === 'po_supplier_customer'
    })
    const { data: dataDOCustomer, isLoading: loadingDOCustomer } = useFetchDOCustomerById(id, {
        enabled: reference_type === 'do_customer'
    })
    
    const dataParent = useMemo(() => {
        // Internal ORder
        if(reference_type === 'pr_catering') return dataPRCatering
        if(reference_type === 'po_catering') return dataPOCatering
        if(reference_type === 'po_supplier_catering') return dataPOSupplierCatering
        if(reference_type === 'do_catering') return dataDOCatering

        // External Order
        if(reference_type === 'pr_customer') return dataPRCustomer
        if(reference_type === 'quotation') return dataQuotation
        if(reference_type === 'po_customer') return dataPOCustomer
        if(reference_type === 'po_supplier_customer') return dataPOSupplierCustomer
        if(reference_type === 'do_customer') return dataDOCustomer

    }, [
        dataPRCatering, dataPOCatering, dataPOSupplierCatering, dataDOCatering, 
        dataPRCustomer, dataQuotation, dataPOCustomer, dataPOSupplierCustomer, dataDOCustomer
    ])

    // Internal Order
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

    // External Order
    if(reference_type === 'pr_customer' && !dataPRCustomer && !loadingPRCustomer){
        return 'Data DO Catering Tidak ditemukan'
    }
    if(reference_type === 'quotation' && !dataQuotation && !loadingQuotation){
        return 'Data Quotation Tidak ditemukan'
    }
    if(reference_type === 'po_customer' && !dataPOCustomer && !loadingPOCustomer){
        return 'Data PO Customer Tidak ditemukan'
    }
    if(reference_type === 'po_supplier_customer' && !dataPOSupplierCustomer && !loadingPOSupplierCustomer){
        return 'Data PO Supplier Customer Tidak ditemukan'
    }
    if(reference_type === 'do_customer' && !dataDOCustomer && !loadingDOCustomer){
        return 'Data DO Customer Tidak ditemukan'
    }

    if(!available.includes(reference_type)){
        return 'Reference Key Tidak Ditemukan'
    }

    return (
      <Page title='File Upload'>
          <Container>
              { !isLoading && 
                !loadingPRCatering && !loadingPOCatering && !loadingPOSupplierCatering && !loadingDOCatering &&
                !loadingPRCustomer && !loadingQuotation && !loadingPOCustomer && !loadingPOSupplierCustomer && !loadingDOCustomer
                    ?
                <Form dataParent={dataParent} reference_type={reference_type} data={data.data} id={id} refetch={refetch} />
              : <Loading />
              }
          </Container>
      </Page>
    )
}

export default Edit;