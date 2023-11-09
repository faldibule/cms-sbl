import { LoadingButton } from '@mui/lab'
import { Box, Breadcrumbs, Button, Card, Grid, IconButton, InputAdornment, Link, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Iconify from '@components/Iconify'
import { useNavigate, useParams } from 'react-router-dom'
import TableInputRow from '@components/meal-sheet-detail/TableInputRow'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import useFetchCustomer from '@hooks/customer/useFetchCustomer'
import useFetchUser from '@hooks/user-list/useFetchUser'
import Loading from '@components/Loading'
import ImportModal from '@components/ImportModal'
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct'
import DialogInputRow from '@components/meal-sheet-detail/DialogInputRow'
import useSaveMealSheetDetail from '@hooks/meal-sheet-detail/useSaveMealSheetDetail'
import useFetchMealSheetDailyById from '@hooks/meal-sheet-daily/useFetchMealSheetDailyById'
import CustomAutocomplete from '@components/CustomAutocomplete'

const Form = (props) => {
    const { data } = props

    const { daily_id, group_id } = useParams()
    const navigate = useNavigate()
    const [item, setItem] = useState([])

    const [clientState, setClientState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedClient = (value) => setClientState({ ...clientState, selected: value })
    const handleInputClient = (value) => setClientState({ ...clientState, input: value })
    const { data: dataClient, isLoading: loadingClient } = useFetchMealSheetDailyById(daily_id)

    const [userState, setUserState] = useState({
        prepared_by: {
            input: '',
            selected: null
        },
        checked_by: {
            input: '',
            selected: null
        },
        approved1_by: {
            input: '',
            selected: null
        },
        approved2_by: {
            input: '',
            selected: null
        },
    })
    const handleUser = (name, type) => {
        return (value) => {
            setUserState({
                ...userState,
                [name]: {
                    ...userState[name],
                    [type]: value
                }
            })
        }
    }
    const { data: dataUser, isLoading: loadingUser } = useFetchUser({ paginate: 0 })

    const [itemState, setItemState] = useState({
        input: '',
        selected: null
    })
    const handleSelectedItem = (value) => setItem([...item, value])
    const handleInputItem = (value) => setItemState({ ...itemState, input: value })
    const { data: dataItemProduct, isLoading: loadingItemProduct } = useFetchItemProduct({ paginate: 0 })

    // Handle Import
    const [modalImport, setModalImport] = useState(false)
    const handleModalImport = () => setModalImport(!modalImport)
    const onSuccessImport = (data) => {
        setItem(data.data)
    }

    // Handle Modal Input
    const [modalInput, setModalInput] = useState(false)
    const handleModalInput = () => setModalInput(!modalInput)

    const deleteItemTable = (e, index) => {
        setItem([...item.filter((v, i) => i !== index)])
    }

    const onChangeByIndex = (index, object) => {
        let temp = []
        if(index !== undefined){
            temp = item.map((v, i) => {
                if(i === index){
                    return {
                        ...object
                    }
                }
                return v
            })
            setItem([...temp])
            return;
        }
        setItem([...item, object])
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveMealSheetDetail({
        onSuccess: () => {
            navigate(`/meal-sheet/detail/${group_id}/${daily_id}`)
        }
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('meal_sheet_daily_id', daily_id)
        formData.append('client_id', clientState.selected?.id)
        item.forEach((v, i) => {
            const breakfast = (v.breakfast === 'on') || (v.breakfast === 1)  ? 1 : 0
            const lunch = (v.lunch === 'on') || (v.lunch === 1)  ? 1 : 0
            const dinner = (v.dinner === 'on') || (v.dinner === 1)  ? 1 : 0
            const superTemp = (v.super === 'on') || (v.super === 1)  ? 1 : 0
            const accomodation = (v.accomodation === 'on') || (v.accomodation === 1)  ? 1 : 0
            formData.append(`meal_sheet_record[${i}][name]`, v.name)
            formData.append(`meal_sheet_record[${i}][position]`, v.position)
            formData.append(`meal_sheet_record[${i}][company]`, v.company)
            formData.append(`meal_sheet_record[${i}][breakfast]`, breakfast)
            formData.append(`meal_sheet_record[${i}][lunch]`, lunch)
            formData.append(`meal_sheet_record[${i}][dinner]`, dinner)
            formData.append(`meal_sheet_record[${i}][super]`, superTemp)
            formData.append(`meal_sheet_record[${i}][accomodation]`, accomodation)
        })
        save({ formData, id: data?.id })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!!props.data){
                setClientState({
                    input: data.client.client_name,
                    selected: data.client
                })
                setItem([...data.meal_sheet_record])
            }
        }

        return () => mounted = false

    }, [props?.id])

    if(loadingClient || loadingUser || loadingItemProduct){
        return <Loading />
    }

    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                        <Typography variant='h5'>                       
                            {props.title === 'add' ? 'Form Input Meal Sheet Detail' : 'Form Edit Meal Sheet Detail' }
                        </Typography>
                        <Breadcrumbs sx={{ fontSize: '0.8rem' }}>
                            <Link underline="hover" color="inherit" href="/meal-sheet/group">Meal Sheet Group</Link>
                            <Link underline="hover" color="inherit" href={`/meal-sheet/report/${group_id}/daily`}>Meal Sheet Report</Link>
                            <Link underline="hover" color="inherit" href={`/meal-sheet/detail/${group_id}/${daily_id}`}>Meal Sheet Detail</Link>
                            <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">
                                {props.title === 'add' ? 'Form Input Meal Sheet Detail' : 'Form Edit Meal Sheet Detail' }
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                </Grid>
            </Grid>

            <Box component='form' onSubmit={onSubmit}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <CustomAutocomplete 
                                getOptionLabel={(opt) => opt.client_name}
                                options={dataClient?.meal_sheet_group?.client}
                                label='Customer'
                                inputValue={clientState.input}
                                setInputValue={handleInputClient}
                                selectedValue={clientState.selected}
                                setSelectedValue={handleSelectedClient}
                                errors={errors?.client_id}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Mandays'
                                name='mandays'
                                defaultValue={data?.mandays}
                                required
                                helperText={!!errors?.mandays && errors?.mandays[0]}
                                error={!!errors?.mandays}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Casual Break Fast'
                                name='casual_breakfast'
                                defaultValue={data?.casual_breakfast}
                                required
                                helperText={!!errors?.casual_breakfast && errors?.casual_breakfast[0]}
                                error={!!errors?.casual_breakfast}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Casual Lunch'
                                name='casual_lunch'
                                defaultValue={data?.casual_lunch}
                                required
                                helperText={!!errors?.casual_lunch && errors?.casual_lunch[0]}
                                error={!!errors?.casual_lunch}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Casual Dinner'
                                name='casual_dinner'
                                defaultValue={data?.casual_dinner}
                                required
                                helperText={!!errors?.casual_dinner && errors?.casual_dinner[0]}
                                error={!!errors?.casual_dinner}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Prepared Name'
                                name='prepared_by[name]'
                                defaultValue={data?.prepared_by['name']}
                                required
                                helperText={!!errors?.['prepared_by.name'] && errors?.['prepared_by.name'][0]}
                                error={!!errors?.['prepared_by.name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Prepared Position'
                                name='prepared_by[position]'
                                defaultValue={data?.prepared_by['position']}
                                required
                                helperText={!!errors?.['prepared_by.position'] && errors?.['prepared_by.position'][0]}
                                error={!!errors?.['prepared_by.position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Checked Name'
                                name='checked_by[name]'
                                defaultValue={data?.checked_by['name']}
                                required
                                helperText={!!errors?.['checked_by.name'] && errors?.['checked_by.name'][0]}
                                error={!!errors?.['checked_by.name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Checked Position'
                                name='checked_by[position]'
                                defaultValue={data?.checked_by['position']}
                                required
                                helperText={!!errors?.['checked_by.position'] && errors?.['checked_by.position'][0]}
                                error={!!errors?.['checked_by.position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Approved Name'
                                name='approved_by[name]'
                                defaultValue={data?.approved_by['name']}
                                required
                                helperText={!!errors?.['approved_by.name'] && errors?.['approved_by.name'][0]}
                                error={!!errors?.['approved_by.name']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth 
                                label='Approved Position'
                                name='approved_by[position]'
                                defaultValue={data?.approved_by['position']}
                                required
                                hhelperText={!!errors?.['approved_by.position'] && errors?.['approved_by.position'][0]}
                                error={!!errors?.['approved_by.position']}
                            /> 
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={1} justifyContent={{ xs: 'space-between', md: 'start' }}>
                                <Button onClick={handleModalInput} fullWidth sx={{ width: { xs: '100%', md: 150 } }} variant='outlined' startIcon={<Iconify icon='ic:baseline-plus' />}>
                                    Add Data
                                </Button>
                                <Button onClick={handleModalImport} fullWidth sx={{ width: { xs: '100%', md: 150 } }} variant='contained' startIcon={<Iconify icon='material-symbols:upload-rounded' />}>
                                    Import
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {item.length > 0 ? 
                                <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                    <Table stickyHeader aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                    bgcolor: '#d6e9ff'
                                                }}
                                            >
                                                <TableCellHeaderColor>No.</TableCellHeaderColor>
                                                <TableCellHeaderColor>Name</TableCellHeaderColor>
                                                <TableCellHeaderColor>Position</TableCellHeaderColor>
                                                <TableCellHeaderColor>Company</TableCellHeaderColor>
                                                <TableCellHeaderColor>Breakfast</TableCellHeaderColor>
                                                <TableCellHeaderColor>Lunch</TableCellHeaderColor>
                                                <TableCellHeaderColor>Dinner</TableCellHeaderColor>
                                                <TableCellHeaderColor>Supper</TableCellHeaderColor>
                                                <TableCellHeaderColor>Total</TableCellHeaderColor>
                                                <TableCellHeaderColor>Accomodation</TableCellHeaderColor>
                                                <TableCellHeaderColor>Action</TableCellHeaderColor>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.map((v, i) => <TableInputRow key={i} i={i} v={v} deleteItemTable={deleteItemTable} onChangeByIndex={onChangeByIndex} errors={errors} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            : 
                            null
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={2}>
                                <LoadingButton loading={loadingSave} variant='contained' type='submit'>
                                    Submit
                                </LoadingButton>
                                {props.title == 'edit' ? ''
                                    // <LoadingButton startIcon={<Iconify icon='material-symbols:print' />} variant='contained' type='button' sx={{ ml: 'auto' }}>
                                    //     Print
                                    // </LoadingButton>
                                : null
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
            <ImportModal 
                handleClose={handleModalImport}
                open={modalImport}
                title='Meal Sheet Detail'
                url={'read-excel/meal-sheet-record'}
                onSuccessImport={onSuccessImport}
            />
            <DialogInputRow 
                handleClose={handleModalInput} 
                open={modalInput} 
                onChangeByIndex={onChangeByIndex}
            />
        </Stack>
    )
}

export default Form