import { Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { NumberFormat } from '../utils/Format'

const CustomGrandTotalComponent = ({ item, discount = 0, markup = 0 }) => {

    const grand_total = useMemo(() => {
      const temp = item.reduce((sum, v) => {
          const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price)

          let tax = 0;
          if(v?.tax === 'yes' || v?.item_product?.tax === 'yes'){
            tax = v.vat ? (price * v.quantity) * parseInt(v.vat) / 100 : 0
          }
          const total = parseInt((price * (v?.quantity || 0)) + tax)
          return sum + total
          
      }, 0)
    return temp
    }, [item])
    const getDiscount = useMemo(() => {
      return grand_total * discount / 100
    }, [grand_total, discount])
    const getMarkup = useMemo(() => {
      if(!markup) return 0
      return grand_total * markup / 100
    }, [grand_total, markup])

    return (
      <Stack justifyContent='end' alignItems='end' textAlign='right'>
          {discount !== 0 ?
            <Stack>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'red' }}>Discount</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'red' }}>{NumberFormat(getDiscount, 'Rp')}</Typography>
            </Stack>
            : null
          }
          {markup !== 0 ?
            <Stack>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'blue' }}>Markup Total</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'blue' }}>{NumberFormat(getMarkup, 'Rp')}</Typography>
            </Stack>
            : null
          }
          <Stack>
              <Typography variant='h6' fontWeight='bold'>Grand Total</Typography>
              <Typography variant='h6' fontWeight='bold'>{NumberFormat(grand_total - getDiscount + getMarkup, 'Rp')}</Typography>
          </Stack>
      </Stack>
    )
}

export default CustomGrandTotalComponent