import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumbs, Button, Card, CardContent, Checkbox, Container, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, Link, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import CustomSearchComponent from '@components/CustomSearchComponent';
import { LoadingButton } from '@mui/lab';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import Loading from '@components/Loading';
import DeleteDialog from '@components/DeleteDialog';
import ImportModal from '@components/ImportModal';
import RefreshDialog from '@components/RefreshDialog';
import useFetchMealSheetMonthly from '@hooks/meal-sheet-monthly/useFetchMealSheetMonthly';
import useDeleteMealSheetMonthly from '@hooks/meal-sheet-monthly/useDeleteMealSheetMonthly';
import useSaveMealSheetMonthly from '@hooks/meal-sheet-monthly/useSaveMealSheetDaily';
import DownloadDialog from '@components/DownloadDialog';
import useDownloadMealSheetMonthly from '@hooks/meal-sheet-monthly/useDownloadMealSheetMonthly';
import CustomLinkComponent from '@components/CustomLinkComponent';

const dataMonth = [
    { month: 'Januari', value: 1 },
    { month: 'Februari', value: 2 },
    { month: 'Maret', value: 3 },
    { month: 'April', value: 4 },
    { month: 'Mei', value: 5 },
    { month: 'Juni', value: 6 },
    { month: 'Juli', value: 7 },
    { month: 'Agustus', value: 8 },
    { month: 'September', value: 9 },
    { month: 'Oktober', value: 10 },
    { month: 'November', value: 11 },
    { month: 'Desember', value: 12 },
];

const getYearList = () => {
    const currentYear = new Date().getFullYear();
    const yearsBefore = [currentYear - 3, currentYear - 2, currentYear - 1];
    const yearList = [...yearsBefore, currentYear];

    return yearList;
};

const getMonthNameByValue = (value) => dataMonth.find(v => v.value === value)?.month || '-'

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
    const { data: rows, refetch, isFetchedAfterMount } = useFetchMealSheetMonthly(params)
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
    const { mutate: deleteMealSheetMonthly, isLoading: loadingDelete, error: errorDelete } = useDeleteMealSheetMonthly({
        onSuccess: () => {
            refreshData()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteMealSheetMonthly(staging?.id)
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveMealSheetMonthly({
        onSuccess: () => {
            refreshData()
            setOpenRefresh(false)
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('meal_sheet_group_id', group_id)
        save({ formData, id: staging?.id })
    }

    const [openRefresh, setOpenRefresh] = useState(false)
    const handleCloseRefresh = (data = null) => {
        if(openRefresh){
            handleReset()
        }
        setOpenRefresh(!openRefresh)
        if(!!!data) return;
        setStaging(data)
    }
    const handleRefresh = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('meal_sheet_group_id', group_id)
        formData.append('month', staging?.month)
        formData.append('year', staging?.year)
        save({ formData, id: staging?.id })
    }

    const { mutate: download, isLoading: loadingDownload, error: errorDownload } = useDownloadMealSheetMonthly({
        onSuccess: (res) => {
            refreshData()
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `monthly_report.pdf`); 
            document.body.appendChild(link);
            link.click();
            setOpenDownload(false)
        }
    })
    const [openDownload, setOpenDownload] = useState(false)
    const handleCloseDownload = (data = null) => {
        if(openDownload){
            handleReset()
        }
        setOpenDownload(!openDownload)
        if(!!!data) return;
        setStaging(data)
    }
    const handleDownload = async (e) => {
        e.preventDefault()
        download(staging?.id)
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
                    {getMonthNameByValue(value.month)}
                </TableCell>
                <TableCell>
                    {value.year}
                </TableCell>
                <TableCell>
                    <CustomLinkComponent 
                        label='View'
                        url={`/meal-sheet/print-preview/monthly/${group_id}/${value.id}`}
                    />
                </TableCell>
                <TableCell>
                    <CustomActionTableComponent 
                        refresh={true}
                        handleRefresh={() => handleCloseRefresh(value)}

                        download={true}
                        handleDownload={() => handleCloseDownload(value)}

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
                        <Stack direction='row' spacing={1}>
                            <CustomSearchComponent 
                                search={params.search}
                                params={params}
                                setParams={setParams}
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
                                <TableCell>Month</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell>Preview PDF</TableCell>
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
                    {!!staging.id ? 'Form Edit Meal Sheet Monthly' : 'Form Add Meal Sheet Monthly'}
                </Typography>
                {!loading ?
                <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Month'
                            name='month'
                            defaultValue={staging?.month || ''}
                            required
                            helperText={!!errors?.month && errors?.month[0]}
                            error={!!errors?.month || !!errors?.meal_sheet_daily_data}
                            select
                        >
                            {dataMonth.map((v, i) => {
                                return (
                                    <MenuItem key={v.value} value={v.value}>{v.month}</MenuItem>
                                )
                            })}
                        </TextField> 
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            fullWidth 
                            label='Year'
                            name='year'
                            defaultValue={staging?.year || ''}
                            required
                            helperText={!!errors?.year && errors?.year[0]}
                            error={!!errors?.year || !!errors?.meal_sheet_daily_data}
                            select
                        >
                            {getYearList().map((v, i) => {
                                return (
                                    <MenuItem key={v} value={v}>{v}</MenuItem>
                                )
                            })}
                        </TextField> 
                        {!!errors?.meal_sheet_daily_data ?
                            <Typography mb={1} fontSize='0.8rem' color='error' variant='body2'>{errors.meal_sheet_daily_data[0]}</Typography>
                        : null
                        }
                    </Grid>
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
                <DownloadDialog 
                    handleClose={handleCloseDownload}
                    handleDownload={handleDownload}
                    open={openDownload}
                    loading={loadingDownload}
                />
                <DeleteDialog 
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                    open={open}
                    loading={loadingDelete}
                />
                <RefreshDialog 
                    handleClose={handleCloseRefresh}
                    handleRefresh={handleRefresh}
                    open={openRefresh}
                    loading={loadingSave}
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