import CustomActionTableComponent from '@components/CustomActionTableComponent';
import CustomLinkBreadcrumsComponent from '@components/CustomLinkBreadcrumsComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import DeleteDialog from '@components/DeleteDialog';
import DownloadDialog from '@components/DownloadDialog';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useDeleteMealSheetDetail from '@hooks/meal-sheet-detail/useDeleteMealSheetDetail';
import useDownloadMealSheetDetail from '@hooks/meal-sheet-detail/useDownloadMealSheetDetail';
import useFetchMealSheetDetail from '@hooks/meal-sheet-detail/useFetchMealSheetDetail';
import { Breadcrumbs, Button, Card, CardContent, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { authentication } from '@recoil/Authentication';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const index = () => {
    const navigate = useNavigate()
    const { daily_id, group_id } = useParams()
    const { user } = useRecoilValue(authentication)
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: '',
        paginate: 1,
        meal_sheet_daily_id: daily_id,
    })
    const { data: rows, refetch, isFetchedAfterMount } = useFetchMealSheetDetail(params)
    
    const [open, setOpen] = useState(false)
    const [staging, setStaging] = useState({})
    const handleClose = (id = null) => {
        setOpen(!open)
        if(!!!id) return;
        setStaging({ id })
    }

    const { mutate: deleteMealSheetDetail, isLoading: loadingDelete } = useDeleteMealSheetDetail({
        onSuccess: () => {
            refetch()
            handleClose()
        }
    })
    const handleDelete = async () => {
        deleteMealSheetDetail(staging?.id)
    }

    const { mutate: download, isLoading: loadingDownload, error: errorDownload } = useDownloadMealSheetDetail({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `daily_mealsheet_report.pdf`); 
            document.body.appendChild(link);
            link.click();
            setOpenDownload(false)
        }
    })
    const [openDownload, setOpenDownload] = useState(false)
    const handleCloseDownload = (data = null) => {
        setOpenDownload(!openDownload)
        if(!!!data) return;
        setStaging(data)
    }
    const handleDownload = async (e) => {
        e.preventDefault()
        download(staging?.id)
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
                        {key + 1}.
                    </TableCell>
                    <TableCell>
                        <CustomLinkComponent 
                            label={value.client.client_name}
                            url={`/meal-sheet/detail/${group_id}/${daily_id}/edit/${value.id}`}
                        />
                    </TableCell>
                    <TableCell>
                        {value.mandays}
                    </TableCell>
                    <TableCell>
                        {value.meal_sheet_daily.contract_value}
                    </TableCell>
                    <TableCell>
                        {value.casual_breakfast}
                    </TableCell>
                    <TableCell>
                        {value.casual_lunch}
                    </TableCell>
                    <TableCell>
                        {value.casual_dinner}
                    </TableCell>
                    <TableCell>
                        <CustomLinkComponent 
                            label='View'
                            url={`/meal-sheet/print-preview/daily/${group_id}/${daily_id}/${value.id}`}
                        />
                    </TableCell>
                    <TableCell>
                        <CustomActionTableComponent 
                            download={true}
                            handleDownload={() => handleCloseDownload(value)}

                            handleDelete={() => handleClose(value.id)}
                        />
                    </TableCell>                                                             
                </TableRow>
            )
        })
    }, [rows])

    return (
        <Page title='Meal Sheet Detail'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Stack spacing={1} mb={3}>
                                <Typography variant='h4'>Meal Sheet Detail</Typography>
                                <Breadcrumbs sx={{ fontSize: '0.8rem' }}>
                                    <CustomLinkBreadcrumsComponent title='Meal Sheet Group' to="/meal-sheet/group" />
                                    <CustomLinkBreadcrumsComponent title='Meal Sheet Report' to={`/meal-sheet/report/${group_id}/daily`} />
                                    <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">Meal Sheet Detail</Typography>
                                </Breadcrumbs>
                            </Stack>
                            <Button onClick={() => navigate(`/meal-sheet/detail/${group_id}/${daily_id}/add`)} variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />}>
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
                                                <TableCell>Client Name</TableCell>
                                                <TableCell>Mandays</TableCell>
                                                <TableCell>As Contract</TableCell>
                                                <TableCell>Casual Breakfast</TableCell>
                                                <TableCell>Casual Lunch</TableCell>
                                                <TableCell>Casual Dinner</TableCell>
                                                <TableCell>Preview PDF</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {renderData()}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <DownloadDialog 
                    handleClose={handleCloseDownload}
                    handleDownload={handleDownload}
                    open={openDownload}
                    loading={loadingDownload}
                />
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