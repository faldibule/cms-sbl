import CustomActionTableComponent from '@components/CustomActionTableComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import DeleteDialog from '@components/DeleteDialog';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useDeleteFormula from '@hooks/formula/useDeleteFormula';
import useFetchFormula from '@hooks/formula/useFetchFormula';
import useCustomSnackbar from '@hooks/useCustomSnackbar';
import { Button, Card, CardContent, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RowData = ({ value, rows, i, refetch }) => {
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)

    const { failed } = useCustomSnackbar()
    const { mutate: deletePOCustomer, isLoading: loadingDelete } = useDeleteFormula({
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
        deletePOCustomer(value.id)
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
            <TableCell>{value.title}</TableCell>
            <TableCell>{value.active == '1' ? 'Active' : 'Not Active'}</TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    handleDelete={handleClose}

                    handleEdit={() => navigate(`/master-data/formula/edit/${value.id}`)}
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
    const { data: rows, refetch, isFetchedAfterMount } = useFetchFormula(params)

    const navigate = useNavigate()

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
        <Page title='Formula Meal Sheet'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Formula Meal Sheet
                            </Typography>
                            <Stack direction='row' spacing={1}>
                                <Button variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />} LinkComponent={Link} to='/master-data/formula/add'>Input</Button>
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
                                                <TableCell>Title</TableCell>
                                                <TableCell>Status</TableCell>
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