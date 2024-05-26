import CustomLinkComponent from '@components/CustomLinkComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useFetchMICSMonthly from '@hooks/mics-monthly/useFetchMICSMonthly';
import { Button, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    const { data: rows, refetch, isFetchedAfterMount } = useFetchMICSMonthly(params)
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
            const month = dataMonth.find(v => v.value === value.month).month
            return (
                <TableRow key={key}>
                    <TableCell
                        component="th"
                        scope="row"
                        align="center"
                    >
                        {rows.meta.from+key}.
                    </TableCell>
                    <TableCell>
                        <CustomLinkComponent label={month} url={`/stock-management/stock-by-location/${location_id}/mics-monthly/detail/${value.id}`} />
                    </TableCell>
                    <TableCell>
                        {value.year}
                    </TableCell>
                </TableRow>
            )
        })
    }, [rows])

    return (
        <Page title='MICS Month'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                MICS Monthly
                            </Typography>
                            <Button onClick={() => navigate(`/stock-management/stock-by-location/${location_id}/mics-monthly/add`)} variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />}>
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
                                        <TableCell>No.</TableCell>
                                        <TableCell>Month</TableCell>
                                        <TableCell>Year</TableCell>
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