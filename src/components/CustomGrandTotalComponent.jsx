import { Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { NumberFormat } from '../utils/Format'

const CustomGrandTotalComponent = ({ item, tax = true, dummy = true }) => {
    const grand_total = useMemo(() => {
      const temp = item.reduce((sum, v) => {
          const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.harga)

          if(dummy){
            const tempShipment = !!v.shipment_charge ? parseInt(v.shipment_charge) : 0
            const tax = !!v.vat ? (price * v.quantity) * parseInt(v.vat) / 100 : 0
            const total = (price * v.quantity) + tax
            const temp_grand_total = total + tempShipment 
            return sum + temp_grand_total
          }

          const tempShipment = !!v.shipment_charge ? parseInt(v.shipment_charge) : 0
          const tax = !!v.vat ? (price * v.quantity) * parseInt(v.vat) / 100 : 0
          const total = (price * (v?.quantity || 0)) + tax
          const temp_grand_total = total + tempShipment 
          return sum + temp_grand_total

          
      }, 0)
    return temp
  }, [item])
  return (
    <Stack justifyContent='end' alignItems='end' textAlign='right'>
        <Stack>
            <Typography variant='h6' fontWeight='bold'>Grand Total</Typography>
            <Typography variant='h6' fontWeight='bold'>{NumberFormat(grand_total, 'Rp')}</Typography>
        </Stack>
    </Stack>
  )
}

export default CustomGrandTotalComponent