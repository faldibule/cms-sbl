import CustomLinkBreadcrumsComponent from '@components/CustomLinkBreadcrumsComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useDownloadMORMonthly from '@hooks/mor-month/useDownloadMORMonthly';
import useFetchMORMonthById from '@hooks/mor-month/useFetchMORMonthById';
import useValueConverter from '@hooks/useValueConverter';
import { LoadingButton } from '@mui/lab';
import { Breadcrumbs, Card, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { NumberFormat } from '@utils/Format';
import { useCallback, useMemo, useState } from 'react';
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

const getMonthByValue = (value) => dataMonth.find(v => v.value === value)

const DataList = ({ v, i }) => {
    const { valueMemo } = useValueConverter(v) 
    return (
        <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.name}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.brand}</TableCell>
            <TableCell sx={{ minWidth: 150 }} align="left">{valueMemo.description}</TableCell>
            <TableCell>
                {v.last_stock || 0}
            </TableCell>
            <TableCell>
                {v.actual_stock || 0}
            </TableCell>
            <TableCell>{NumberFormat(valueMemo.price, 'Rp')}</TableCell>
        </TableRow>
    )
}

const index = () => {
    const navigate = useNavigate()
    const { location_id, id } = useParams()
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
        location_id,
        id,
    })
    const { data: detailMORMonthly, isLoading } = useFetchMORMonthById(params)
    const rows = useMemo(() => detailMORMonthly?.detail, [detailMORMonthly])

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

    const { mutate: download, isLoading: loadingDownload } = useDownloadMORMonthly({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `MOR.xlsx`); 
            document.body.appendChild(link);
            link.click();
        },
    })
    const handleDownload = async (e) => {
        e.preventDefault()
        download({
            location_id,
            month: detailMORMonthly?.mor_month.month,
            year: detailMORMonthly.mor_month.year
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
            return <DataList i={key} v={value} key={value?.id} />
        })
    }, [detailMORMonthly])

    if(!isLoading && !detailMORMonthly){
        return 'Data MOR Monthly Tidak Ditemukan!'
    }
    if(isLoading){
        return <Loading />
    }


    return (
        <Page title='MOR Month'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack mb={2} spacing={1} justifyContent='space-between' direction={{ xs: 'row', md: 'row' }} alignItems='center'>
                            <Stack>
                                <Typography variant='h4'>
                                    MOR Monthly - {detailMORMonthly.mor_month.location.location} ({getMonthByValue(detailMORMonthly.mor_month.month).month}/{detailMORMonthly.mor_month.year})
                                </Typography>
                                <Breadcrumbs sx={{ fontSize: '0.8rem', height: 30, mt: 1 }}>
                                    <CustomLinkBreadcrumsComponent title='Stock Management' to="/stock-management" />
                                    <CustomLinkBreadcrumsComponent title='MOR Monthly' to={`/stock-management/stock-by-location/${location_id}/mor-month`} />
                                    <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">
                                    MOR Monthy Product
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                            <LoadingButton startIcon={<Iconify icon='material-symbols:upload-rounded'  />} loading={loadingDownload} onClick={handleDownload} variant='contained'>Export</LoadingButton>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 2 }}>
                            <Grid container sx={{ mb: 2 }} alignItems="center">
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
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Item Brand</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Last Stock</TableCell>
                                            <TableCell>Actual Stock</TableCell>
                                            <TableCell>Unit Price</TableCell>
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
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;