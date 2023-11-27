import React, { useMemo } from 'react'

const useValueConverter = (v, markup = 0) => {
    const valueMemo = useMemo(() => {
        return {
            name: v?.item_product?.name || v?.name || v?.item_name || '',
            brand: v?.item_product?.brand || v?.brand || '',
            size: v?.item_product?.size || v?.size || v?.item_size || '',
            unit: v?.item_product?.unit?.param || v?.unit?.param || v?.unit || '',
            description: v?.item_product?.description || v?.description,
            price: parseInt(v?.price) || parseInt(v?.item_price) || parseInt(v?.item_product?.price),
            tax: v?.tax || v?.item_product?.tax,
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

    const grand_total = useMemo(() =>  parseInt(total + (isNaN(tax) ? 0 : tax)), [total, tax])

    const markUpMemo = useMemo(() => {
        return {
            markupPrice: valueMemo?.price + (valueMemo?.price * markup / 100),
            markupTotal: total + (total * markup / 100)
        }
    }, [valueMemo, total, markup])

    return {
        valueMemo,
        total,
        tax,
        grand_total,
        markUpMemo
    }
}

export default useValueConverter