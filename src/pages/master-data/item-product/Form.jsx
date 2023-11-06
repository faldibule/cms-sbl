import CustomAutocomplete from '@components/CustomAutocomplete'
import Loading from '@components/Loading'
import useFetchItemCategory from '@hooks/item-category/useFetchItemCategory'
import useSaveItemProduct from '@hooks/item-product/useSaveItemProduct'
import useFetchLocation from '@hooks/location/useFetchLocation'
import useFetchSupplier from '@hooks/supplier/useFetchSupplier'
import useFetchUnit from '@hooks/unit/useFetchUnit'
import { LoadingButton } from '@mui/lab'
import { Box, Card, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { IntegerFormat, NumberFormat } from '@utils/Format'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const Form = (props) => {
    const { data } = props
    // Unit 
    const { data: unitData, isLoading: loadingUnit } = useFetchUnit({ paginate: 0 })

    // Handle Category & Sub Category
    const [category, setCategory] = useState('')
    const { data: itemCategory, isLoading: loadingCategory } = useFetchItemCategory({ paginate: 0 })
    const handleCategory = (e) => setCategory(e.target.value)
    const filteredDataParentCategory = useMemo(() => {
        const temp = itemCategory?.data.filter(v => {
            return !!!v.parent_category?.id
        })
        return !!temp ? temp : []
    }, [itemCategory]) 
    const filteredDataChildCategory = useMemo(() => {
        if(category === '') return []
        const temp = itemCategory?.data.filter(v => {
            return !!v.parent_category?.id && v.parent_category?.id === category
        })
        return !!temp ? temp : []
    }, [itemCategory, category]) 
    const renderInputParentCategory = () => {
        if(filteredDataParentCategory.length === 0){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return filteredDataParentCategory.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.category_code} - {v.category}</MenuItem>
            )
        })
    }
    const renderInputChildCategory = () => {
        if(filteredDataChildCategory.length === 0){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return filteredDataChildCategory.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.category_code} - {v.category}</MenuItem>
            )
        })
    }

    // Handle Location
    const [locationState, setLocationState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedLocation = (value) => setLocationState({...locationState, selected: value})
    const handleInputLocation = (value) => setLocationState({...locationState, input: value})
    const { data: dataLocation, isLoading: loadingLocation } = useFetchLocation({ paginate: 0 })

    // Supplier Handle
    const [supplierState, setSupplierState] = useState({
        input: '',
        selected: ''
    })
    const handleSelectedSupplier = (value) => setSupplierState({...supplierState, selected: value})
    const handleInputSupplier = (value) => setSupplierState({...supplierState, input: value})
    const { data: dataSupplier, isLoading: loadingSupplier } = useFetchSupplier({ paginate: 0 })

    // Handle Price
    const [price, setPrice] = useState('')
    const handlePrice = (v) => setPrice(NumberFormat(v, 'Rp'))

    // HandleSubmit
    const { mutate: save, isLoading: loadingSave, error } = useSaveItemProduct({
        onSuccess: () => {
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('location_id', locationState.selected?.id)
        formData.append('supplier_id', supplierState.selected?.id)
        formData.append('price', IntegerFormat(price)) 
        save({ formData, id: data?.id })
    }

    const renderUnitMenuItem = useCallback(() => {
        if(loadingUnit) return null
        if(unitData.length === 0 ){
            return (
                <MenuItem value='' disabled>Kosong</MenuItem>
            )
        }
        return unitData.map((v) => {
            return (
                <MenuItem key={v.id} value={v.id}>{v.param}</MenuItem>
            )
        })

    }, [unitData])

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!data){
                setCategory(data.item_category.id)
                setLocationState({
                    input: `${data.location.location_code} - ${data.location.location}`,
                    selected: data.location
                })
                setSupplierState({
                    input: data.supplier.name,
                    selected: data.supplier
                })
                handlePrice(data.price)
            }
        }

        return () => mounted = false

    }, [props.id])

    if(loadingUnit || loadingCategory || loadingLocation || loadingSupplier){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Typography variant='h5'>
                        {props.title === 'add' ? 'Form Input Item Product' : 'Form Edit Item Product' }
                    </Typography>
                </Grid>
            </Grid>

            <Box>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Code'
                                name='code'
                                defaultValue={data?.code}
                                required
                                helperText={!!errors?.code && errors?.code[0]}
                                error={!!errors?.code}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Name'
                                name='name'
                                defaultValue={data?.name}
                                required
                                helperText={!!errors?.name && errors?.name[0]}
                                error={!!errors?.name}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Brand'
                                name='brand'
                                defaultValue={data?.brand}
                                required
                                helperText={!!errors?.brand && errors?.brand[0]}
                                error={!!errors?.brand}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Size'
                                name='size'
                                defaultValue={data?.size}
                                required
                                helperText={!!errors?.size && errors?.size[0]}
                                error={!!errors?.size}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth 
                                label='Price'
                                name='price'
                                value={price}
                                onChange={(e) => handlePrice(e.target.value)}
                                required
                                helperText={!!errors?.price && errors?.price[0]}
                                error={!!errors?.price}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled={loadingCategory}
                                fullWidth 
                                label='Category'
                                select
                                name='item_category_id'
                                value={category}
                                onChange={handleCategory}
                                required
                                helperText={!!errors?.item_category_id && errors?.item_category_id[0]}
                                error={!!errors?.item_category_id}
                            >
                                {renderInputParentCategory()}
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled={category === ''}
                                fullWidth 
                                label='Sub Category'
                                select
                                name='sub_item_category_id'
                                defaultValue={data?.sub_item_category?.id || ''}
                                required
                                helperText={!!errors?.sub_item_category_id && errors?.sub_item_category_id[0]}
                                error={!!errors?.sub_item_category_id}
                            >
                                {renderInputChildCategory()}
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                options={dataLocation.data}
                                getOptionLabel={(option) => `${option.location_code} - ${option.location}`}
                                label='Location'
                                inputValue={locationState.input}
                                setInputValue={handleInputLocation}
                                selectedValue={locationState.selected}
                                setSelectedValue={handleSelectedLocation}
                                errors={errors?.location_id}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete 
                                options={dataSupplier.data}
                                getOptionLabel={(option) => `${option.name}`}
                                label='Supplier'
                                inputValue={supplierState.input}
                                setInputValue={handleInputSupplier}
                                selectedValue={supplierState.selected}
                                setSelectedValue={handleSelectedSupplier}
                                errors={errors?.supplier_id}
                                key='supplier'
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Unit'
                                select
                                name='unit_id'
                                defaultValue={data?.unit?.id || ''}
                                required
                                helperText={!!errors?.unit_id && errors?.unit_id[0]}
                                error={!!errors?.unit_id}
                                disabled={loadingUnit}
                            >
                                {renderUnitMenuItem()} 
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Tax'
                                select
                                name='tax'
                                defaultValue={data?.tax}
                                required
                                helperText={!!errors?.tax && errors?.tax[0]}
                                error={!!errors?.tax}
                            >
                                <MenuItem value='yes'>Yes</MenuItem>
                                <MenuItem value='no'>No</MenuItem>
                            </TextField> 
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                fullWidth 
                                label='Description'
                                name='description'
                                defaultValue={data?.description}
                                required
                                multiline
                                rows={3}
                                helperText={!!errors?.description && errors?.description[0]}
                                error={!!errors?.description}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={2}>
                                <LoadingButton loading={loadingSave} variant='contained' type='submit'>
                                    Submit
                                </LoadingButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Stack>
    )
}

export default Form