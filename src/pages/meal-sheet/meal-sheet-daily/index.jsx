import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumbs, Button, Card, CardContent, Checkbox, Container, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, Link, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import Iconify from '@components/Iconify';
import moment from 'moment/moment';
import CustomSearchComponent from '@components/CustomSearchComponent';
import CustomStatusLabelComponent from '@components/CustomStatusLabelComponent';
import CustomMenuComponent from '@components/CustomMenuComponent';
import { LoadingButton } from '@mui/lab';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import useFetchMealSheetDaily from '@hooks/meal-sheet-daily/useFetchMealSheetDaily';
import useDeleteMealSheetDaily from '@hooks/meal-sheet-daily/useDeleteMealSheetDaily';
import useSaveMealSheetDaily from '@hooks/meal-sheet-daily/useSaveMealSheetDaily';
import Loading from '@components/Loading';
import DeleteDialog from '@components/DeleteDialog';
import ImportModal from '@components/ImportModal';

let dummy = []
for(let i = 0; i < 15; i++){
    dummy[i] = {
        code: i + 1,
        date: new Date(),
        as_contract: 45
    }

}

const index = () => {
    const { group_id } = useParams()
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
        meal_sheet_group_id: group_id,
        meal_sheet_date: moment(new Date()).format('yyyy/MM/DD')
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
                        url={`/meal-sheet/detail/${value.id}`}
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
        <Page title='Meal Sheet Daily'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Stack spacing={1} mb={3}>
                                <Typography variant='h4'>Meal Sheet Daily</Typography>
                                <Breadcrumbs sx={{ fontSize: '0.8rem' }}>
                                    <Link underline="hover" color="inherit" href="/meal-sheet/sheet-detail">Meal Sheet Group</Link>
                                    <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">Meal Sheet Daily</Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                    <Grid item xs={12} md={12}>
                                        <Stack direction='row' spacing={1}>
                                            <CustomSearchComponent 
                                                search={params.search}
                                                params={params}
                                                setParams={setParams}
                                            />
                                            <TextField
                                                type='date'
                                                label="Date"
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
                                    </Grid>
                                </Grid>
                                <TableContainer sx={{ maxWidth: 1000, overflowX: 'auto' }}>
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
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2 }}>
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
                            title='Meal Sheet Daily'
                            url={'meal-sheet/daily'}
                            refreshData={refreshData}
                        />
                    </Grid>
                </Grid>

            </Container>
        </Page>
    );
};
export default index;