import { useState } from 'react'
import { Box, Button, Card, CardContent, Checkbox, Container, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import CustomSearchComponent from '@components/CustomSearchComponent';
import { LoadingButton } from '@mui/lab';
import useFetchSupplier from '@hooks/supplier/useFetchSupplier';
import useSaveSupplier from '@hooks/supplier/useSaveSupplier';
import useDeleteSupplier from '@hooks/supplier/useDeleteSupplier';
import Loading from '@components/Loading';
import DeleteDialog from '@components/DeleteDialog';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import { IntegerFormat, NpwpFormat } from '@utils/Format';

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const [npwp, setNpwp] = useState('')
    const handleNpwp = (value) => setNpwp(NpwpFormat(value))
    const { data: rows, refetch, isFetchedAfterMount } = useFetchSupplier(params)
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
            setNpwp('')
            setLoading(false)
        }, 0);
    }
    const handleEdit = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging(data)
            // handleNpwp('11111111')
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

    const { mutate: deleteSupplier, isLoading: loadingDelete } = useDeleteSupplier({
        onSuccess: () => {
            handleReset()
            refetch()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteSupplier(staging?.id)
    }

    const { mutate: save, isLoading: loadingSave, error } = useSaveSupplier({
        onSuccess: () => {
            handleReset()
            refetch()
        }
    })
    const errors = error?.response?.data?.errors
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('npwp', IntegerFormat(npwp))
        save({ formData, id: staging?.id })
    }

    if(isFetchedAfterMount && params.page !== 1 && rows !== undefined && rows?.data.length === 0){
        setParams({ ...params, page: rows.meta.last_page })
    }

    const renderData = () => {
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
                    {value.code}
                </TableCell>
                <TableCell>
                    {value.name}
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
    }

    return (
        <Page title='Supplier'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Supplier
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={7}>
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
                                                <TableCell>Supplier Type</TableCell>
                                                <TableCell>Company Name</TableCell>
                                                {/* <TableCell>Category</TableCell> */}
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
                    <Grid item xs={12} md={5}>
                        <Card sx={{ p: 2 }}>
                            <Typography mb={3} variant='h6'>
                                {!!staging.id ? 'Form Edit Supplier' : 'Form Add Supplier'}
                            </Typography>
                            {!loading ? 
                                <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth 
                                            label='Supplier Code'
                                            name='code'
                                            defaultValue={staging?.code}
                                            required
                                            helperText={!!errors?.code && errors?.code[0]}
                                            error={!!errors?.code}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Supplier Type'
                                            name='type'
                                            defaultValue={staging?.type}
                                            required
                                            helperText={!!errors?.type && errors?.type[0]}
                                            error={!!errors?.type}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Company Name'
                                            name='name'
                                            defaultValue={staging?.name}
                                            required
                                            helperText={!!errors?.name && errors?.name[0]}
                                            error={!!errors?.name}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Category Supplier'
                                            name='category'
                                            defaultValue={staging?.category}
                                            required
                                            helperText={!!errors?.category && errors?.category[0]}
                                            error={!!errors?.category}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='NPWP'
                                            name='npwp'
                                            value={npwp}
                                            onChange={(e) => handleNpwp(e.target.value)}
                                            required
                                            helperText={!!errors?.npwp && errors?.npwp[0]}
                                            error={!!errors?.npwp}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Supplier Contact Person'
                                            name='contact_person'
                                            defaultValue={staging?.contact_person}
                                            required
                                            helperText={!!errors?.contact_person && errors?.contact_person[0]}
                                            error={!!errors?.contact_person}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth 
                                            label='Supplier Email'
                                            name='email'
                                            defaultValue={staging?.email}
                                            required
                                            helperText={!!errors?.email && errors?.email[0]}
                                            error={!!errors?.email}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth 
                                            label='Supplier Phone'
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                                            }}
                                            type='number'
                                            name='phone'
                                            defaultValue={staging?.phone}
                                            required
                                            helperText={!!errors?.phone && errors?.phone[0]}
                                            error={!!errors?.phone}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth 
                                            label='Supplier Address'
                                            name='address'
                                            defaultValue={staging?.address}
                                            required
                                            helperText={!!errors?.address && errors?.address[0]}
                                            error={!!errors?.address}
                                            multiline
                                            rows={3}
                                        /> 
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
                            : 
                                <Box minHeight={500}>
                                    <Loading />
                                </Box>
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