import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Chip, Container, Grid, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import Iconify from '@components/Iconify';
import moment from 'moment/moment';
import CustomSearchComponent from '@components/CustomSearchComponent';
import CustomStatusLabelComponent from '@components/CustomStatusLabelComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import useFetchQuotation from '@hooks/quotation/useFetchQuotation';
import useDeleteQuotation from '@hooks/quotation/useDeleteQuotation';
import DeleteDialog from '@components/DeleteDialog';
import Loading from '@components/Loading';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import ApproveDialog from '@components/UpdateStatusDialog';
import useApproveQuotation from '@hooks/quotation/useApproveQuotation';
import { useRecoilValue } from 'recoil';
import { authentication } from '@recoil/Authentication';

const index = () => {
    const navigate = useNavigate()
    const { user } = useRecoilValue(authentication)
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchQuotation(params)
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
    
    const [open, setOpen] = useState(false)
    const [staging, setStaging] = useState({})
    const handleClose = (id = null) => {
        setOpen(!open)
        if(!!!id) return;
        setStaging({ id })
    }

    const { mutate: deleteQuotation, isLoading: loadingDelete } = useDeleteQuotation({
        onSuccess: () => {
            refetch()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteQuotation(staging?.id)
    }

    const [openApprove, setOpenApprove] = useState(false)
    const handleCloseApprove = (value = null) => {
        setOpenApprove(!openApprove)
        if(!!!value) return;
        setStaging(value)
    }
    const { mutate: approveQuotation, isLoading: loadingApprove } = useApproveQuotation({
        onSuccess: () =>{
            handleCloseApprove()
            refetch()
        }
    })
    const handleApprove = async () => {
        if(!!!staging?.id) return ;

        let status = ''
        if(!!!staging?.approved_date){
            status = 'approved'
        }
        if(!!!staging?.checked_date){
            status = 'checked'
        }
        approveQuotation({ status, id: staging.id })
    }

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
            const status = {
                label: !!value.approved_date ? 'Approved' : !!value.checked_date ? 'Checked' : 'Pending',
                color: !!value.approved_date ? 'success' : !!value.checked_date ? 'primary' : 'warning'
            }
            const isChecker = true
            const isApprover = true
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
                        <CustomLinkComponent label={value.quotation_number} url={`/quotation/edit/${value.id}`} />
                    </TableCell>
                    <TableCell>
                        {value.customer.name}
                    </TableCell>
                    <TableCell>
                        {moment(value.shipment_date).format('LL')}
                    </TableCell>
                    <TableCell>
                        {value.prepared_by.name}
                    </TableCell>
                    <TableCell>
                        <Chip label={status.label} color={status.color} />
                    </TableCell>
                    <TableCell>
                        <CustomActionTableComponent 
                            approve={(isChecker &&!value.checked_date) || (isApprover && !value.approved_date)}
                            handleApprove={() => handleCloseApprove(value)}
                            handleDelete={() => handleClose(value.id)}
                        />
                    </TableCell>                                                             
                </TableRow>
            )
        })
    }, [rows])

    return (
        <Page title='Quotation'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Quotation
                            </Typography>
                            <Button onClick={() => navigate('/quotation/add')} variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />}>
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
                                                <TableCell>Quotation Number</TableCell>
                                                <TableCell>Customer Name</TableCell>
                                                <TableCell>Shipment Date</TableCell>
                                                <TableCell>Prepared By</TableCell>
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
                <DeleteDialog 
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                    open={open}
                    loading={loadingDelete}
                />
                <ApproveDialog 
                    handleClose={handleCloseApprove}
                    handleApprove={handleApprove}
                    open={openApprove}
                    loading={loadingApprove}
                />
            </Container>
        </Page>
    );
};
export default index;