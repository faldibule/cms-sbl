import CustomActionTableComponent from '@components/CustomActionTableComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import DeleteDialog from '@components/DeleteDialog';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useDeleteMealRate from '@hooks/meal-rate/useDeleteMealRate';
import useFetchMealRate from '@hooks/meal-rate/useFetchMealRate';
import useCustomSnackbar from '@hooks/useCustomSnackbar';
import { Button, Card, CardContent, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { NumberFormat } from '@utils/Format';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RowData = ({ value, rows, i, refetch }) => {
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)

    const { failed } = useCustomSnackbar()
    const { mutate: deleteMealRate, isLoading: loadingDelete } = useDeleteMealRate({
        onSuccess: () => {
            refetch()
            handleClose()
        },
        onError: (err) => {
            handleClose()
            failed('Unable to delete this Formula!')
        }
    })
    const handleDelete = async () => {
        deleteMealRate(value.id)
    }
    return (
        <TableRow>
            <TableCell
                component="th"
                scope="row"
                align="center"
            >
                {rows.meta.from+i}.
            </TableCell>
            <TableCell>{value.name}</TableCell>
            <TableCell>{value.minimum}</TableCell>
            <TableCell>{NumberFormat(value?.breakfast, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(value?.lunch, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(value?.dinner, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(value?.supper, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(value?.hk, 'Rp')}</TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    handleDelete={handleClose}

                    handleEdit={() => navigate(`/master-data/meal-rate/edit/${value.id}`)}
                    edit={true}
                />
            </TableCell>
            <DeleteDialog 
                handleClose={handleClose}
                handleDelete={handleDelete}
                open={open}
                loading={loadingDelete}
            />
        </TableRow>
    )
}

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchMealRate(params)

    // Handle Page
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
        return rows.data.map((value, key) => {
            return <RowData refetch={refetch} rows={rows} i={key} key={value.id} value={value} />
        })
    }, [rows])

    // HandleTable
    if(isFetchedAfterMount && params.page !== 1 && rows !== undefined && rows?.data.length === 0){
        setParams({ ...params, page: rows.meta.last_page })
    }

    return (
        <Page title='Meal Rate'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Meal Rate
                            </Typography>
                            <Stack direction='row' spacing={1}>
                                <Button variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />} LinkComponent={Link} to='/master-data/meal-rate/add'>Input</Button>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
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
                                                <TableCell>Name</TableCell>
                                                <TableCell>Minimum</TableCell>
                                                <TableCell>Breakfast</TableCell>
                                                <TableCell>Lunch</TableCell>
                                                <TableCell>Dinner</TableCell>
                                                <TableCell>Supper</TableCell>
                                                <TableCell>HK</TableCell>
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
                </Grid>
            </Container>
        </Page>
    );
};
export default index;