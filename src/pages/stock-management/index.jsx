import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Chip, Container, Grid, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import useFetchLocation from '@hooks/location/useFetchLocation';
import Loading from '@components/Loading';
const arry = [1, 2, 3, 4, 5, 6]
const index = () => {
    const navigate = useNavigate()
    const [params, setParams] = useState({
        search: '',
        paginate: 0,
    })
    const { data: rows, isLoading: loadingLocation, refetch, isFetchedAfterMount } = useFetchLocation(params)
    
    if(loadingLocation){
        return <Loading />
    }

    return (
        <Page title='Stock Management'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>Stock Management</Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Grid container spacing={2}>
                            {rows.data?.map(v => {
                                return (
                                    <Grid key={v.id} item xs={12} md={v.main === 1 ? 12 : 4}>
                                        <Card>
                                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/stock-management/stock-by-location/${v?.id}`}>
                                                <CardContent>
                                                    <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                                        <Grid item xs={12} md={12}>
                                                            <Typography fontWeight='bold' textAlign='center'>{v.location}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Link>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;