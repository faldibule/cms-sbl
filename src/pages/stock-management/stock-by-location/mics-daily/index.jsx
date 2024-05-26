import CustomLinkComponent from '@components/CustomLinkComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useFetchMICSDaily from '@hooks/mics-daily/useFetchMICSDaily';
import { Button, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const index = () => {
    const navigate = useNavigate()
    const { location_id } = useParams()
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
        location_id,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchMICSDaily(params)
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
        return rows.data.map((value, key) => {
            return (
                <TableRow key={key}>
                    <TableCell>
                        {moment(value.date).format('LL')}
                    </TableCell>
                    <TableCell>
                        <CustomLinkComponent label='View' url={`/stock-management/stock-by-location/${location_id}/mics-daily/edit/${value.date}`} />
                    </TableCell>
                </TableRow>
            )
        })
    }, [rows])

    return (
        <Page title='MICS Daily'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                MICS Daily
                            </Typography>
                            <Button onClick={() => navigate(`/stock-management/stock-by-location/${location_id}/mics-daily/add`)} variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />}>
                                Add
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                            <Grid item xs={12} md={12}>
                                <CustomSearchComponent 
                                    setParams={setParams}
                                    search={params.search}
                                    params={params}
                                />
                            </Grid>
                        </Grid>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                            "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                        }}
                                    >
                                        <TableCell>Date</TableCell>
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
                </Grid>
            </Container>
        </Page>
    );
};
export default index;