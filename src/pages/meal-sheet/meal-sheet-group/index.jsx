import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Container, Grid, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import Iconify from '@components/Iconify';
import CustomSearchComponent from '@components/CustomSearchComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import { useRecoilValue } from 'recoil';
import { authentication } from '@recoil/Authentication';
import DeleteDialog from '@components/DeleteDialog';
import Loading from '@components/Loading';
import CustomActionTableComponent from '@components/CustomActionTableComponent';
import useFetchMealSheetGroup from '@hooks/meal-sheet-group/useFetchMealSheetGroup';
import useDeleteMealSheetGroup from '@hooks/meal-sheet-group/useDeleteMealSheetGroup';

const index = () => {
    const navigate = useNavigate()
    const { user } = useRecoilValue(authentication)
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchMealSheetGroup(params)
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

    const { mutate: deleteMealSheetGroup, isLoading: loadingDelete } = useDeleteMealSheetGroup({
        onSuccess: () => {
            refetch()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteMealSheetGroup(staging?.id)
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
                        {value.location.location}
                    </TableCell>
                    <TableCell>
                        {value.client[0].client_name}
                    </TableCell>
                    <TableCell>
                        {value.client[1].client_name}
                    </TableCell>
                    <TableCell>
                        <CustomLinkComponent label='View' url={`/meal-sheet/daily/${value.id}`} />
                    </TableCell>
                    <TableCell>
                        <CustomActionTableComponent 
                            handleDelete={() => handleClose(value.id)}
                            edit={true}
                            handleEdit={() => navigate(`/meal-sheet/group/edit/${value.id}`)}
                        />
                    </TableCell>                                                             
                </TableRow>
            )
        })
    }, [rows])

    return (
        <Page title='Meal Sheet Group'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>Meal Sheet Group</Typography>
                            <Button onClick={() => navigate('/meal-sheet/group/add')} variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />}>
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
                                                <TableCell>Location</TableCell>
                                                <TableCell>Client 1</TableCell>
                                                <TableCell>Client 2</TableCell>
                                                <TableCell>Meal Sheet Daily</TableCell>
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
            </Container>
        </Page>
    );
};
export default index;