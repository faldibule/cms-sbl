import CustomActionTableComponent from '@components/CustomActionTableComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import DeleteDialog from '@components/DeleteDialog';
import ImportModal from '@components/ImportModal';
import Loading from '@components/Loading';
import useDeleteMealSheetDaily from '@hooks/meal-sheet-daily/useDeleteMealSheetDaily';
import useFetchMealSheetDaily from '@hooks/meal-sheet-daily/useFetchMealSheetDaily';
import useSaveMealSheetDaily from '@hooks/meal-sheet-daily/useSaveMealSheetDaily';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import moment from 'moment/moment';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

const index = () => {
    const { group_id } = useParams()
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
        meal_sheet_group_id: group_id,
        meal_sheet_date: ''
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchMealSheetDaily(params)
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
            setLoading(false)
        }, 0);
    }
    const handleEdit = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging(data)
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
    }
    const { mutate: deleteMealSheetDaily, isLoading: loadingDelete, error: errorDelete } = useDeleteMealSheetDaily({
        onSuccess: () => {
            refreshData()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteMealSheetDaily(staging?.id)
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveMealSheetDaily({
        onSuccess: () => {
            refreshData()
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('meal_sheet_group_id', group_id)
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
                    {rows.meta.from+key}.
                </TableCell>
                <TableCell>
                    {value.meal_sheet_date}
                </TableCell>
                <TableCell>
                    {value.contract_value}
                </TableCell>
                <TableCell>
                    <CustomLinkComponent 
                        label='View'
                        url={`/meal-sheet/detail/${group_id}/${value.id}`}
                    />
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
    }, [rows])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8} p={2}>
                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                    <Grid item xs={12} md={12}>
                        <Stack spacing={2}>
                            <CustomSearchComponent 
                                search={params.search}
                                params={params}
                                setParams={setParams}
                            />
                            <Stack direction='row' spacing={1}>
                                <TextField
                                    type='date'
                                    label="Start Date"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                    }}
                                    value={moment(params.meal_sheet_date).format('yyyy-MM-DD')}
                                    onChange={(e) => {
                                        setParams({
                                            ...params,
                                            meal_sheet_date: e.target.value
                                        })
                                    }}
                                />
                                <TextField
                                    type='date'
                                    label="Until Date"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                    }}
                                    value={moment(params.meal_sheet_date).format('yyyy-MM-DD')}
                                    onChange={(e) => {
                                        setParams({
                                            ...params,
                                            meal_sheet_date: e.target.value
                                        })
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table sx={{ minWidth: 400 }} aria-label="simple table">
                        <TableHead>
                            <TableRow
                                sx={{
                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                }}
                            >
                                <TableCell>No.</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>As Contract</TableCell>
                                <TableCell>Meal Sheet Detail</TableCell>
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
            </Grid>
            <Grid item xs={12} md={4} p={2}>
                <Typography mb={3} variant='h6'>
                    {!!staging.id ? 'Form Edit Meal Sheet Daily' : 'Form Add Meal Sheet Daily'}
                </Typography>
                {!loading ?
                <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='As Contract'
                            name='contract_value'
                            defaultValue={staging?.contract_value}
                            required
                            helperText={!!errors?.contract_value && errors?.contract_value[0]}
                            error={!!errors?.contract_value}
                        /> 
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            type='date'
                            label="Date"
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            name='meal_sheet_date'
                            helperText={!!errors?.meal_sheet_date && errors?.meal_sheet_date[0]}
                            error={!!errors?.meal_sheet_date}
                            defaultValue={staging?.meal_sheet_date}
                        />
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                        <FormGroup sx={{ display: 'flex', ml: 1, justifyContent: { xs: 'space-evenly', md: 'inherit' }}} row={true}>
                            <FormControlLabel control={<Checkbox  />} label="Breakfast" />
                            <FormControlLabel control={<Checkbox  />} label="Lunch" />
                            <FormControlLabel control={<Checkbox  />} label="Casual" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup sx={{ display: 'flex', ml: 1, justifyContent: { xs: 'space-evenly', md: 'inherit' }}} row={true}>
                            <FormControlLabel control={<Checkbox  />} label="Dinner" />
                            <FormControlLabel control={<Checkbox  />} label="Super" />
                            <FormControlLabel control={<Checkbox  />} label="Acomodation" />
                        </FormGroup>
                    </Grid> */}
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' spacing={2}>
                            <LoadingButton loading={loadingSave} fullWidth variant='contained' type='submit'>
                                Submit
                            </LoadingButton>
                            <Button variant='outlined' onClick={handleReset} fullWidth>Reset</Button>
                        </Stack>
                    </Grid>
                </Grid>
                : <Loading />
                }
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
                    title='Meal Sheet Daily'
                    url={'meal-sheet/daily'}
                    refreshData={refreshData}
                />
            </Grid>
        </Grid>
    );
};
export default index;