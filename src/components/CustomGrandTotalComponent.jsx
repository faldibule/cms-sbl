import { Stack, Typography } from '@mui/material'
import { IntegerFormat, NumberFormat } from '@utils/Format'
import { useMemo } from 'react'

const CustomGrandTotalComponent = ({ item, discount = 0, markup = false }) => {

    const getTotal = useMemo(() => {
      let totalAmount = 0
      let totalVAT = 0
      item.map((value) => {
          const { tax } = value.item_product
          const tnt = value?.tnt || 'T'
          const isHasTax = tax === 'yes'
          let vat = isHasTax ? 11 : 0
          const price = parseInt(value?.price) || parseInt(value?.item_price) || parseInt(value?.item_product?.price)

          if(markup){
            const newPrice = (price * vat / 100) + price
            const markUpPriceConverted = IntegerFormat(value?.markupPrice || 'Rp.0')
            const vatAmount = tnt === 'T' ? ((newPrice + markUpPriceConverted) * (value?.quantity || 0)) * 11 / 100 : 0 
            
            totalAmount = totalAmount + ((newPrice + markUpPriceConverted) * (value?.quantity || 0))
            totalVAT = totalVAT + vatAmount
            return;
          }

          totalAmount = totalAmount + (price * (value?.quantity || 0))
          totalVAT = totalVAT + ((price * (value?.quantity || 0)) * vat / 100)
      })
      return {
          totalAmount,
          totalVAT,
      }
    }, [item])

    const getDiscount = useMemo(() => {
      return (getTotal.totalAmount + getTotal.totalVAT) * discount / 100
    }, [getTotal, discount])

    return (
      <Stack justifyContent='end' alignItems='end' textAlign='right' spacing={0.5}>
          {discount !== 0 ?
            <Stack>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'red' }}>Discount</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'red' }}>{NumberFormat(getDiscount, 'Rp')}</Typography>
            </Stack>
            : null
          }
          <Stack>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'blue' }}>Total</Typography>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'blue' }}>{NumberFormat(getTotal.totalAmount, 'Rp')}</Typography>
          </Stack>
          <Stack>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'green' }}>Total VAT</Typography>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'green' }}>{NumberFormat(getTotal.totalVAT, 'Rp')}</Typography>
          </Stack>
          <Stack>
              <Typography variant='h6' fontWeight='bold'>Grand Total</Typography>
              <Typography variant='h6' fontWeight='bold'>{NumberFormat(getTotal.totalAmount + getTotal.totalVAT - getDiscount)}</Typography>
          </Stack>
      </Stack>
    )
}

export default CustomGrandTotalComponent