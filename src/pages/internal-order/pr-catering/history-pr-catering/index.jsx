import CustomLinkBreadcrumsComponent from '@components/CustomLinkBreadcrumsComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';
import CustomSearchComponent from '@components/CustomSearchComponent';
import Loading from '@components/Loading';
import Page from '@components/Page';
import useFetchHistory from '@hooks/history/useFetchHistory';
import useFetchPRCateringById from '@hooks/pr-catering/useFetchPRCateringById';
import { Breadcrumbs, Card, CardContent, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

const index = () => {
    const { pr_catering_id } = useParams()
    const [params, setParams] = useState({
        reference_type: 'pr_catering',
        reference_id: pr_catering_id
    })
    const { data: rows } = useFetchHistory(params)
    const { data: detailPRCatering, isLoading: loadingDetailPRCatering } = useFetchPRCateringById(pr_catering_id)

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
        if(rows.length === 0){
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
        return rows.map((value, i) => {
            return (
                <TableRow key={i}>
                    <TableCell
                        component="th"
                        scope="row"
                        align="center"
                    >
                        {i + 1}.
                    </TableCell>
                    <TableCell>
                        <CustomLinkComponent label={value.order_number} url={`/internal-order/history-pr-catering/${pr_catering_id}/detail/${value.id}`} />
                    </TableCell>                                                         
                    <TableCell>
                        {moment(value.created_at).format('LL')}
                    </TableCell>
                </TableRow>
            )
        })
    }, [rows])

    if(!loadingDetailPRCatering && !detailPRCatering){
        return 'PR Catering Tidak ditemukan'
    }

    if(loadingDetailPRCatering){
        return <Loading />
    }

    return (
        <Page title='History PR Catering'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack>
                            <Typography variant='h4'>
                                History PR Catering - {detailPRCatering.pr_number}
                            </Typography>
                            <Breadcrumbs sx={{ fontSize: '0.8rem', my: 1 }}>
                                <CustomLinkBreadcrumsComponent title='PR Catering' to="/internal-order/pr-catering" />
                                <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">History PR Catering</Typography>
                            </Breadcrumbs>
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
                                                <TableCell>PR Number</TableCell>
                                                <TableCell>Generate Time</TableCell>
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
            </Container>
        </Page>
    );
};
export default index;