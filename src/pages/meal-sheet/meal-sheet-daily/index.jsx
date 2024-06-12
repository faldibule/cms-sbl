import CustomActionTableComponent from '@components/CustomActionTableComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import DeleteDialog from '@components/DeleteDialog';
import Iconify from '@components/Iconify';
import ImportModal from '@components/ImportModal';
import Loading from '@components/Loading';
import useDeleteMealSheetDaily from '@hooks/meal-sheet-daily/useDeleteMealSheetDaily';
import useDownloadMultipleMealSheetDaily from '@hooks/meal-sheet-daily/useDownloadMultipleMealSheetDaily';
import useFetchMealSheetDaily from '@hooks/meal-sheet-daily/useFetchMealSheetDaily';
import useSaveMealSheetDaily from '@hooks/meal-sheet-daily/useSaveMealSheetDaily';
import { LoadingButton } from '@mui/lab';
import { Button, Checkbox, Grid, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import moment from 'moment/moment';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

function CustomToolBar({ numSelected, actionNode }) {
    return (
        <Toolbar
            sx={{
                mt: 6.5,
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                mb: -1,
                py: 4,
                ...(numSelected > 0 && {
                    bgcolor: '#F7F7F7',
                    color: 'black'
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : null }

            {numSelected > 0 ? (
                actionNode
            ) : null
            }
        </Toolbar>
    );
}

const index = () => {
    const { group_id } = useParams()
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
        meal_sheet_group_id: group_id,
        meal_sheet_date: '',
        start_date: '',
        end_date: '',
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

    const { mutate: downloadMultipleMealSheetDaily, isLoading: loadingDownloadMultipleMealSheetDaily } = useDownloadMultipleMealSheetDaily({
        onSuccess: (res) => {
            console.log(res)
            setSelected([])
            const temp = window.URL.createObjectURL(new Blob([res.data], { type: 'application/x-zip' }));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `meal_sheet_report.zip`); 
            document.body.appendChild(link);
            link.click();
        }
    })
    const handleDownloadMultipleMealSheetDaily = () => {
        // let baseUrl = 'http://localhost:8000/meal-sheet/daily/meal_sheet_pdf/multiple';

        // // Create a string to hold the query parameters
        // let queryString = '';

        // // Loop through the mealSheetDailyIds array to construct the query parameters
        // selected.forEach((id, index) => {
        //     // Append each meal_sheet_daily_id value to the query string
        //     queryString += `meal_sheet_daily_id[meal_sheet_daily_id][${index}]=${encodeURIComponent(id)}&`;
        // });

        // // Remove the trailing '&' character
        // queryString = queryString.slice(0, -1);

        // // Construct the final URL by appending the query string to the base URL
        // let url = `${baseUrl}?${queryString}`;


        // const link = document.createElement("a");
        // link.href = url;
        // link.target = '_blank';
        // document.body.appendChild(link);
        // link.click();
        downloadMultipleMealSheetDaily({
            meal_sheet_daily_id: selected
        })
    }

    // Handle Checkbox
    const [selected, setSelected] = useState([])
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected([...newSelected]);
    };
    const isSelected = (index) => selected.indexOf(index) !== -1;
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelected = rows?.data?.map((n, i) => n.id);
          setSelected(newSelected);
          return;
        }
        setSelected([]);
    };

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
            <TableRow key={value.id}>
                <TableCell padding="checkbox">
                    <Checkbox
                        onClick={(event) => handleClick(event, value.id)}
                        color="primary"
                        checked={isSelected(value.id)}
                        inputProps={{
                            'aria-labelledby': value.id,
                        }}
                    />
                </TableCell>
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
    }, [rows, selected])

    if(isFetchedAfterMount && params.page !== 1 && rows !== undefined && rows?.data.length === 0){
        setParams({ ...params, page: rows.meta.last_page })
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8} p={2}>
                {selected.length > 0 ?
                    <CustomToolBar 
                        numSelected={selected.length} 
                        actionNode={
                            <Stack direction='row' spacing={1} pr={{ md: 5, xs: 1 }}>
                                <LoadingButton loading={loadingDownloadMultipleMealSheetDaily} onClick={handleDownloadMultipleMealSheetDaily} variant='outlined' color='primary'>Export</LoadingButton>
                            </Stack>
                        }
                    />
                :
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
                                    value={moment(params.start_date).format('yyyy-MM-DD')}
                                    onChange={(e) => {
                                        setParams({
                                            ...params,
                                            start_date: e.target.value
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
                                    value={moment(params.end_date).format('yyyy-MM-DD')}
                                    onChange={(e) => {
                                        setParams({
                                            ...params,
                                            end_date: e.target.value
                                        })
                                    }}
                                />
                                <Button 
                                    onClick={() => setParams({ 
                                        page: 1,
                                        limit: 5,
                                        search: '',
                                        paginate: 1,
                                        meal_sheet_group_id: group_id,
                                        meal_sheet_date: '',
                                        start_date: '',
                                        end_date: '', 
                                    })}
                                >
                                    Clear
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                }
                
                <TableContainer>
                    <Table sx={{ minWidth: 400 }} aria-label="simple table">
                        <TableHead>
                            <TableRow
                                sx={{
                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#2065D1',
                                            },
                                            '&.MuiCheckbox-indeterminate': {
                                                color: '#2065D1'
                                            }
                                        }}
                                        color='default'
                                        indeterminate={selected.length > 0 && selected.length < rows?.data?.length}
                                        checked={rows?.data?.length > 0 && selected.length === rows?.data?.length}
                                        onChange={handleSelectAllClick}
                                        inputProps={{
                                            'aria-label': 'select meal sheet daily',
                                        }}
                                    />
                                </TableCell>
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