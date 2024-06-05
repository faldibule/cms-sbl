import CustomActionTableComponent from '@components/CustomActionTableComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import DownloadDialog from '@components/DownloadDialog';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';
import useDownloadSales from '@hooks/sales/useDownloadSales';
import useFetchSales from '@hooks/sales/useFetchSales';
import { Button, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

const getMonthNameByValue = (value) => dataMonth.find(v => v.value === value)?.month || '-'

const TableRowData = ({ value, refetch, rows, i }) => {
    const navigate = useNavigate()

    const [openDownload, setOpenDownload] = useState(false)
    const handleCloseDownload = () => {
        setOpenDownload(!openDownload)
    }

    const { mutate: download, isLoading: loadingDownload, error: errorDownload } = useDownloadSales({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `sales-report-${getMonthNameByValue(value.month)}-${value.year}.xlsx`); 
            document.body.appendChild(link);
            link.click();
            setOpenDownload(false)
        }
    })

    const handleDownload = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('year', value.year)
        formData.append('month', value.month)
        download({ formData })
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
            <TableCell>{value.location?.location}</TableCell>
            <TableCell>{getMonthNameByValue(value.month)}</TableCell>
            <TableCell>{value.year}</TableCell>
            <TableCell>
                <CustomActionTableComponent 
                    canDelete={false}

                    handleEdit={() => navigate(`/report/sales/edit/${value.id}`)}
                    edit={true}

                    download={true}
                    handleDownload={handleCloseDownload}
                />
            </TableCell>
            <DownloadDialog 
                handleClose={handleCloseDownload}
                handleDownload={handleDownload}
                loading={loadingDownload}
                open={openDownload}
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
    const { data: rows, refetch, isFetchedAfterMount } = useFetchSales(params)
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
                <TableRowData value={value} key={value.id} rows={rows} refetch={refetch} i={key} />
            )
        })
    }, [rows])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12} p={2}>
                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                    <Grid item xs={12}>
                        <Stack justifyContent='end' direction='row' spacing={1}>
                            <Button variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />} LinkComponent={Link} to='/report/sales/add'>Add Data</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' spacing={1}>
                            <CustomSearchComponent 
                                search={params.search}
                                params={params}
                                setParams={setParams}
                            />
                        </Stack>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table sx={{ minWidth: 400 }} aria-label="simple table">
                        <TableHead>
                            <TableRow
                                sx={{
                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                }}
                            >
                                <TableCell>No.</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Month</TableCell>
                                <TableCell>Year</TableCell>
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
    );
};
export default index;