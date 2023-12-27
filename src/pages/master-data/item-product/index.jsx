import CustomActionTableComponent from '@components/CustomActionTableComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import DeleteDialog from '@components/DeleteDialog';
import Iconify from '@components/Iconify';
import ImportModal from '@components/ImportModal';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useDeleteItemProduct from '@hooks/item-product/useDeleteItemProduct';
import useFetchItemProduct from '@hooks/item-product/useFetchItemProduct';
import useCustomSnackbar from '@hooks/useCustomSnackbar';
import { Button, Card, CardContent, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { NumberFormat } from '@utils/Format';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

const index = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchItemProduct(params)

    const { failed } = useCustomSnackbar()

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
    
    // Handle Action
    const [loading, setLoading] = useState(false)
    const [staging, setStaging] = useState({})
    const handleReset = (data) => {
        setLoading(true)
        setTimeout(() => {
            setStaging({})
            setLoading(false)
        }, 0);
    }
    
    const [modalImport, setModalImport] = useState(false)
    const handleModalImport = () => setModalImport(!modalImport)
    
    // Handle Dialog Delete
    const [open, setOpen] = useState(false)
    const handleClose = (id = null) => {
        if(open){
            handleReset()
        }
        setOpen(!open)
        if(!!!id) return;
        setStaging({ id })
    }
    const { mutate: deleteItemProduct, isLoading: loadingDelete } = useDeleteItemProduct({
        onSuccess: () => {
            handleReset()
            refetch()
            handleClose()
        },
        onError: (err) => {
            if(err.response.status === 500){
                failed('Unable to delete this Item Product!')
            }
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteItemProduct(staging?.id)
    }

    // HandleTable
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
                    <CustomLinkComponent label={value.code} url={`/master-data/item-product/edit/${value.id}`} />
                </TableCell>
                <TableCell>
                    {value.name}
                </TableCell>
                <TableCell>
                    {NumberFormat(value.price, 'Rp')}
                </TableCell>
                <TableCell>
                    {value.supplier.name}
                </TableCell>
                <TableCell>
                    {value.location.location}
                </TableCell>
                <TableCell>
                    {value.tax}
                </TableCell>
                <TableCell>
                    <CustomActionTableComponent 
                        handleDelete={() => handleClose(value.id)}
                    />
                </TableCell>                                                             
            </TableRow>
        ))
    }, [rows])

    return (
        <Page title='Item Product'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Item Product
                            </Typography>
                            <Stack direction='row' spacing={1}>
                                <Button variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />} LinkComponent={Link} to='/master-data/item-product/add'>Input</Button>
                                <Button variant='contained' onClick={handleModalImport} startIcon={<Iconify icon='uil:import' />}>Import</Button>
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
                                                <TableCell>Code</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Supplier</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Tax</TableCell>
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
                    <Grid item xs={12} md={12}>
                        <DeleteDialog 
                            handleClose={handleClose}
                            handleDelete={handleDelete}
                            open={open}
                            loading={loadingDelete}
                        />
                        <ImportModal 
                            handleClose={handleModalImport}
                            open={modalImport}
                            title='Item Product & Category'
                            url={'item-product/import-category-product-price'}
                            refreshData={refetch}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;