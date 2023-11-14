import {  useCallback, useMemo, useState } from 'react'
import { Autocomplete, Button, Card, CardContent, Checkbox, Container, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import CustomSearchComponent from '@components/CustomSearchComponent';
import { LoadingButton } from '@mui/lab';
import Loading from '@components/Loading';
import DeleteDialog from '@components/DeleteDialog';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import useFetchLocation from '@hooks/location/useFetchLocation';
import useDeleteLocation from '@hooks/location/useDeleteLocation';
import useSaveLocation from '@hooks/location/useSaveLocation';
import Iconify from '@components/Iconify';
import ImportModal from '@components/ImportModal';

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const [selectedValue, setSelectedValue] = useState(null);
    const [inputValue, setInputValue] = useState('')
    const { data: rows, refetch, isFetchedAfterMount } = useFetchLocation(params)
    const { data: parentLocation, refetch: refetchParentLocation, isLoading: loadingParent  } = useFetchLocation({ paginate: 1, search: inputValue, limit: 3, only_parent: 1 })

    const handleChangePage = (event, newPage) => {
        setParams((prev) => {
            return {
                ...prev,
                page: newPage + 1,
            };
        });
    };
    const handleChangeRowsPerPage = (event) => {
        setParams((prev) => {
            return {
                ...prev,
                page: 1,
                limit: +event.target.value,
            };
        });
    };
    
    const [loading, setLoading] = useState(false)
    const [staging, setStaging] = useState({})
    const handleReset = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging({})
            setInputValue('')
            setLoading(false)
            setSelectedValue(null)
        }, 0);
    }
    const handleEdit = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging(data)
            if(!!data.parent_location){
                const parentLocation = data.parent_location
                setInputValue(`${parentLocation.location_code} - ${parentLocation.location}`)
                setSelectedValue()
            }
            setLoading(false)
        }, 500);
    }
    
    const [open, setOpen] = useState(false)
    const handleClose = (id = null) => {
        if(open){
            handleReset()
        }
        setOpen(!open)
        if(!!!id) return;
        setStaging({ id })
    }

    const refreshData = () => {
        handleReset()
        refetch()
        refetchParentLocation()
    }

    const { mutate: deleteDepartment, isLoading: loadingDelete } = useDeleteLocation({
        onSuccess: () => {
            refreshData()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteDepartment(staging?.id)
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveLocation({
        onSuccess: () => {
            refreshData()
        }
    })
    const errors = error?.response?.data?.errors
    const handleParentLocationId = () => {
        let parent_location_id = ''
        if(!!selectedValue){
            parent_location_id = selectedValue.id
        }else{
            if(!!staging.parent_location?.id && inputValue !== ''){
                parent_location_id = staging.parent_location?.id
            }
        }
        return parent_location_id
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const parent_location_id = handleParentLocationId()
        formData.append('parent_location_id', parent_location_id)
        save({ formData, id: staging?.id })
    }

    const [modalImport, setModalImport] = useState(false)
    const handleModalImport = () => setModalImport(!modalImport)

    if(isFetchedAfterMount && params.page !== 1 && rows !== undefined && rows?.data.length === 0){
        setParams({ ...params, page: rows.meta.last_page })
    }

    const renderData = useCallback(() => {
        if(rows === undefined) {
            return (
                <TableRow>
                    <TableCell
                        component="th"
                        scope="row"
                        sx={{
                            textAlign: "center",
                            py: 5,
                        }}
                        colSpan={10}
                    >
                        <Loading />
                    </TableCell>
                </TableRow>
            )
        } 
        if(rows.data.length === 0){
            return (
                <TableRow>
                    <TableCell
                        component="th"
                        scope="row"
                        sx={{
                            textAlign:
                                "center",
                            py: 10,
                        }}
                        colSpan={10}
                    >
                        No result found
                        {params.search !==
                            "" && (
                            <div
                                style={{
                                    display:
                                        "inline-block",
                                }}
                            >
                                &nbsp;for "<b>{params.search}</b>"
                            </div>
                        )}
                        .
                    </TableCell>
                </TableRow>
            )
        }
        return rows.data.map((value, key) => (
            <TableRow key={key}>
                <TableCell
                    component="th"
                    scope="row"
                    align="center"
                >
                    {rows.meta
                        .from +
                        key}
                    .
                </TableCell>
                <TableCell>
                    {value.location_code}
                </TableCell>
                <TableCell>
                    {value.location}
                </TableCell>
                <TableCell>
                    {value?.parent_location?.location || '-'}
                </TableCell>
                <TableCell>
                    <CustomActionTableComponent 
                        edit={true}
                        handleEdit={() => handleEdit(value)}
                        handleDelete={() => handleClose(value.id)}
                    />
                </TableCell>                                                             
            </TableRow>
        ))
    })
    const filteredData = useMemo(() => {
        const temp = parentLocation?.data.filter(v => {
            if(!!staging.id){
                return v.id !== staging.id
            }
            return true
        })
        return !!temp ? temp : []
    }, [parentLocation, staging]) 

    return (
        <Page title='Site Location'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack justifyContent='space-between' mb={3} direction='row' alignitems='center'>
                            <Stack>
                                <Typography variant='h4'>
                                    Site Location
                                </Typography>
                            </Stack>
                            <Button variant='contained' onClick={handleModalImport} startIcon={<Iconify icon='uil:import' />}>Import</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                    <Grid item xs={12} md={12}>
                                        <CustomSearchComponent 
                                            params={params}
                                            search={params.search}
                                            setParams={setParams}
                                        />
                                    </Grid>
                                </Grid>
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                }}
                                            >
                                                <TableCell>No.</TableCell>
                                                <TableCell>Code</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Parent</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {renderData()}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {rows !== undefined && rows.data.length > 0 && (
                                    <TablePagination
                                        component="div"
                                        count={rows.meta.total}
                                        page={params.page - 1}
                                        rowsPerPage={params.limit}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage
                                        }
                                        rowsPerPageOptions={[
                                            1, 5, 10, 25, 50, 100,
                                        ]}
                                        showFirstButton
                                        showLastButton
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2 }}>
                            <Typography mb={3} variant='h6'>
                                {!!staging.id ? 'Form Edit Location' : 'Form Add Location'}
                            </Typography>
                            {!loading ?
                                <Stack rowGap={2} component='form' onSubmit={onSubmit}>
                                    <TextField
                                        fullWidth 
                                        label='Code'
                                        name='location_code'
                                        defaultValue={staging?.location_code}
                                        required
                                        helperText={!!errors?.location_code && errors?.location_code[0]}
                                        error={!!errors?.location_code}
                                    /> 
                                    <TextField
                                        fullWidth 
                                        label='Location Name'
                                        name='location'
                                        defaultValue={staging?.location}
                                        required
                                        helperText={!!errors?.location && errors?.location[0]}
                                        error={!!errors?.location}
                                    /> 
                                    {console.log(staging)}
                                    <Autocomplete
                                        freeSolo
                                        disabled={staging?.main === 1}
                                        options={filteredData}
                                        getOptionLabel={(option) => `${option.location_code} - ${option.location}`}
                                        value={selectedValue || null} 
                                        inputValue={inputValue}
                                        onInputChange={(e, value, reason) => {
                                            setInputValue(value)
                                        }}
                                        onChange={(event, newValue) => {
                                            setSelectedValue(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                fullWidth
                                                label="Parent Location" 
                                                error={!!errors?.parent_location_id}
                                                helperText={!!errors?.parent_location_id && errors?.parent_location_id[0]}
                                            />
                                        )}
                                    />
                                    <Stack direction='row' spacing={2}>
                                        <LoadingButton loading={loadingSave} fullWidth variant='contained' type='submit'>
                                            Submit
                                        </LoadingButton>
                                        <Button variant='outlined' onClick={handleReset} fullWidth>Reset</Button>
                                    </Stack>
                                </Stack>
                            : <Loading />
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <DeleteDialog 
                            handleClose={handleClose}
                            handleDelete={handleDelete}
                            open={open}
                            loading={loadingDelete}
                        />
                        <ImportModal 
                            handleClose={handleModalImport}
                            open={modalImport}
                            title='Location'
                            url={'location/import'}
                            refreshData={refreshData}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;