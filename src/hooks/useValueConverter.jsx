import { IntegerFormat, NumberFormat } from '@utils/Format'
import { useMemo } from 'react'

const useValueConverter = (v) => {
    const valueMemo = useMemo(() => {
        const price = parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price)
        const tax = v?.tax || v?.item_product?.tax

        const taxValue = tax === 'yes' ? 11 : 0
        const taxPrice = price * taxValue / 100
        const newPrice = price + taxPrice

        const markupPrice = !!v?.markupPrice && !isNaN(v?.markupPrice) ? 
                                v?.markupPrice : 
                                    !!v?.markup_value ? 
                                        NumberFormat(v?.markup_value, 'Rp') : 
                                            NumberFormat(v?.item_product?.sell_price - newPrice, 'Rp') 
        
        const markupPercentage = v?.markupPercentage || IntegerFormat(markupPrice) / newPrice * 100 || 0
        return {
            name: v?.item_product?.name || v?.name || v?.item_name || '',
            brand: v?.item_product?.brand || v?.brand || '',
            size: v?.item_product?.size || v?.size || v?.item_size || '',
            unit: v?.item_product?.unit?.param || v?.unit?.param || v?.unit || '',
            description: v?.item_product?.description || v?.description,
            price,
            tax,
            markupPrice,
            markupPercentage,
            tnt: v?.tnt || 'T',
        }
    }, [v]) 

    const total = useMemo(() => (valueMemo.price * (v?.quantity || 0)), [valueMemo.price, v?.quantity])

    const tax = useMemo(() => {
        let vat = 11
        if(valueMemo.tax !== 'yes'){
            return 0
        }
        if(!!v.vat){
            vat = parseInt(v.vat)
        }
        return total * vat / 100
    }, [total, v?.vat, valueMemo.tax])

    const eachTax = useMemo(() => {
        let vat = 11
        if(valueMemo.tax !== 'yes'){
            return 0
        }
        if(!!v.vat){
            vat = parseInt(v.vat)
        }
        return valueMemo.price * vat / 100
    }, [valueMemo.price, v?.vat, valueMemo.tax])

    const newPrice = useMemo(() => {
        return valueMemo.price + eachTax
    }, [valueMemo.price, eachTax])

    const grand_total = useMemo(() =>  parseInt(total + (isNaN(tax) ? 0 : tax)), [total, tax])

    const markUpMemo = useMemo(() => {
        const markUpPriceConverted = IntegerFormat(valueMemo.markupPrice)
        return {
            markupTotal: (markUpPriceConverted) * (v?.quantity || 0),
            markupValue: (markUpPriceConverted + newPrice),
        }
    }, [valueMemo.markupPrice, newPrice, v?.quantity])

    const amount = useMemo(() => {
        const markUpPriceConverted = IntegerFormat(valueMemo.markupPrice)
        return (newPrice + markUpPriceConverted) * (v?.quantity || 0)
    }, [newPrice, v?.quantity, valueMemo.markupPrice])

    const vatAmmount = useMemo(() => {
        let vat = 11
        if(valueMemo.tnt === 'NT'){
            return 0
        }
        return parseInt(amount * vat / 100)
    }, [amount, valueMemo.tnt])

    return {
        valueMemo,
        total,
        tax,
        newPrice,
        eachTax,
        grand_total,
        markUpMemo,
        amount,
        vatAmmount
    }
}

export default useValueConverter