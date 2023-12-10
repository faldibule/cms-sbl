import CustomSearchComponent from '@components/CustomSearchComponent';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useDownloadActivitylog from '@hooks/activity-log/useDownloadActivitylog';
import useFetchActivitylog from '@hooks/activity-log/useFetchActivitylog';
import { LoadingButton } from '@mui/lab';
import { Card, CardContent, Container, Grid, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import moment from 'moment/moment';
import { useCallback, useState } from 'react';

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
        from_date: '',
        until_date: '',
        export: 0,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchActivitylog(params)
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

    const { mutate: download, isLoading: loadingExport } = useDownloadActivitylog({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `activity_log.csv`); 
            document.body.appendChild(link);
            link.click();
        }
    })
    const handleDownload = () => {
        download({
            ...params,
            export: 1,
            paginate: 0,
        })
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
                <TableRow key={value.id}>
                    <TableCell
                        component="th"
                        scope="row"
                        align="center"
                    >
                        {rows.meta.from + key}.
                    </TableCell>
                    <TableCell>
                        {value.log_name}
                    </TableCell>
                    <TableCell>
                        {value.description}
                    </TableCell>
                    <TableCell>
                        {value.user || '-'}
                    </TableCell>
                    <TableCell>
                        {value.ip}
                    </TableCell>
                    <TableCell>
                        {value.browser}
                    </TableCell>
                    <TableCell>
                        {value.os}
                    </TableCell>
                    <TableCell>
                        {moment(value.created_at).format('llll')}
                    </TableCell>
                </TableRow>
            )
        })
    }, [rows])

    return (
        <Page title='Activity Log'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Activity Log
                            </Typography>
                            <LoadingButton loading={loadingExport} onClick={handleDownload} variant='contained' startIcon={<Iconify icon='uil:export' />}>
                                Export
                            </LoadingButton>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={12} md={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={12}>
                                                <CustomSearchComponent 
                                                    params={params}
                                                    search={params.search}
                                                    setParams={setParams}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    type='date'
                                                    label="From Date"
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                                    }}
                                                    value={moment(params.from_date).format('yyyy-MM-DD')}
                                                    onChange={(e) => {
                                                        setParams({
                                                            ...params,
                                                            from_date: e.target.value
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    type='date'
                                                    label="Until Date"
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                                    }}
                                                    value={moment(params.until_date).format('yyyy-MM-DD')}
                                                    onChange={(e) => {
                                                        setParams({
                                                            ...params,
                                                            until_date: e.target.value
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
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
                                                <TableCell>Log Name</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>User</TableCell>
                                                <TableCell>Ip</TableCell>
                                                <TableCell>Browser</TableCell>
                                                <TableCell>OS</TableCell>
                                                <TableCell>Created At</TableCell>
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