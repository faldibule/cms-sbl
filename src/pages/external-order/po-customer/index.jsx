import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Container, Grid, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import Iconify from '@components/Iconify';
import moment from 'moment/moment';
import CustomSearchComponent from '@components/CustomSearchComponent';
import CustomStatusLabelComponent from '@components/CustomStatusLabelComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import useFetchPOCatering from '@hooks/po-catering/useFetchPOCatering';
import Loading from '@components/Loading';
import TableDataRow from '@components/po-catering/TableDataRow';
import CustomActionTableComponent from '@components/CustomActionTableComponent';

const temp = {
    rows: undefined,
    refetch: () => {},
    isFetchedAfterMount: true
}
const index = () => {
    const navigate = useNavigate()
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    // const { data: rows, refetch, isFetchedAfterMount } = useFetchPOCatering(params)
    const { data: rows, refetch, isFetchedAfterMount } = temp
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
            return <TableDataRow key={key} value={value} rows={rows} i={key} refetch={refetch} />
        })
    }, [rows])

    return (
        <Page title='PO Customer'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                PO Customer
                            </Typography>
                            <Button onClick={() => navigate('/external-order/po-customer/add')} variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />}>
                                Input
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
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
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                }}
                                            >
                                                <TableCell>No.</TableCell>
                                                <TableCell>PO Number</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Request Date</TableCell>
                                                <TableCell>User Maker</TableCell>
                                                <TableCell>Reject Reason</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableCell>1</TableCell>
                                            <TableCell>
                                                <CustomLinkComponent label='PO00001' url='/external-order/po-customer/edit/123' />
                                            </TableCell>
                                            <TableCell>Jakarta</TableCell>
                                            <TableCell>2023/11/11</TableCell>
                                            <TableCell>Syaiful</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>Checked</TableCell>
                                            <TableCell>
                                                <CustomActionTableComponent
                                                    approve={true}
                                                    handleApprove={() => {}}
                                                    handleDelete={() => {}}
                                                />
                                            </TableCell>
                                            {/* {renderData()} */}
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