import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Checkbox, Container, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import moment from 'moment/moment';
import CustomSearchComponent from '../../../components/CustomSearchComponent';
import CustomStatusLabelComponent from '../../../components/CustomStatusLabelComponent';
import CustomMenuComponent from '../../../components/CustomMenuComponent';
import { LoadingButton } from '@mui/lab';
import useCustomSnackbar from '@hooks/useCustomSnackbar';
import http from '@variable/Api';
import Loading from '@components/Loading';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import { useQuery } from 'react-query';
import DeleteDialog from '@components/DeleteDialog';

let dummy = []
for(let i = 0; i < 15; i++){
    dummy[i] = {
        code: i + 1,
        name: `Cost Center ${i + 1}`,
    }
}

const index = () => {
    const navigate = useNavigate()
    const { success, failed } = useCustomSnackbar()
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
    })
    const getCostCenter = async (signal) => {
        try {
            const res = await http.get('cost-center', {
                signal,
                params
            })
            return res.data.data
        } catch (err) {
            // console.log(err)
        }
    }
    const { data: rows, isLoading, refetch, isFetchedAfterMount } = useQuery(["cost-center", params], ({signal}) => getCostCenter(signal))
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
    
    const [loadingButton, setLoadingButton] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [loading, setLoading] = useState(false)

    const [staging, setStaging] = useState({})
    const handleReset = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging({})
            setErrors({})
            setLoading(false)
        }, 0);
    }
    const handleEdit = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging(data)
            setErrors({})
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
    const handleDelete = async () => {
        setLoadingDelete(true)
        try {
            const res = await http.delete(`cost-center/${staging?.id}`)
            success('Success Delete Cost Center!')
        } catch (err) {
            // console.log(err.response)
        } finally {
            refetch()
            setLoadingDelete(false)
            setStaging({})
            handleClose()
        }
    }

    const [errors, setErrors] = useState({})
    const handleSave = async (formData) => {
        try {
            if(!!staging.id){
                const res = await http.patch(`cost-center/${staging.id}`, {}, {
                    params: {
                        ...Object.fromEntries(formData)
                    }
                })
                success('Success Edit Cost Center')
            }else{
                const res = await http.post('cost-center', formData)
                success('Success Add Cost Center')
            }
            refetch()
            handleReset()
        } catch (err) {
            if(!!err.response){
                setErrors(err.response.data.errors)
            } 
        } finally {
            setLoadingButton(false)
        }
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        setErrors({})
        setLoadingButton(true)
        handleSave(formData)
    }

    if(isFetchedAfterMount && params.page !== 1 && rows !== undefined && rows?.data.length === 0){
        setParams({ ...params, page: rows.meta.last_page })
    }

    return (
        <Page title='Cost Center'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Cost Center
                            </Typography>
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
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows !== undefined ? (
                                                rows.data.length > 0 ? (
                                                    rows.data.map((value, key) => (
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
                                                                {value.cost_center_code}
                                                            </TableCell>
                                                            <TableCell>
                                                                {value.cost_center}
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
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            sx={{
                                                                textAlign: "center",
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
                                            ) : (
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
                                            )}
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
                            <Typography mb={3} variant='h6'>Form Cost Center</Typography>
                            {!loading ?
                                <Stack rowGap={2} component='form' onSubmit={onSubmit}>
                                    <TextField
                                        fullWidth 
                                        label='Code'
                                        name='cost_center_code'
                                        defaultValue={staging?.cost_center_code}
                                        required
                                        helperText={!!errors?.cost_center_code && errors?.cost_center_code[0]}
                                        error={!!errors?.cost_center_code}
                                    /> 
                                    <TextField
                                        fullWidth 
                                        label='Cost Center Name'
                                        name='cost_center'
                                        defaultValue={staging?.cost_center}
                                        required
                                        helperText={!!errors?.cost_center && errors?.cost_center[0]}
                                        error={!!errors?.cost_center}
                                    /> 
                                    <Stack direction='row' spacing={2}>
                                        <LoadingButton loading={loadingButton} fullWidth variant='contained' type='submit'>
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
                    </Grid>
                </Grid>

            </Container>
        </Page>
    );
};
export default index;