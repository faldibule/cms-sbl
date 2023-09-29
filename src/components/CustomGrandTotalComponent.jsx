import { Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { NumberFormat } from '../utils/Format'

const CustomGrandTotalComponent = ({ item, tax = true }) => {
    const grand_total = useMemo(() => {
      const temp = item.reduce((sum, v) => {
          const tempShipment = !!v.shipment_charge ? parseInt(v.shipment_charge) : v.shipment_charge ?? 0
          const tempVat = !!v.vat ? parseInt(v.vat) : v.vat ?? 0
          const total = v.harga * v.quantity
          const temp_grand_total = total + tempShipment + tempVat + (tax ? (total * 11 / 100) : 0)
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