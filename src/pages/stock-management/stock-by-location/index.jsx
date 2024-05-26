import Iconify from '@components/Iconify';
import Page from '@components/Page';
import { Box, Breadcrumbs, Card, CardContent, Container, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';

import MICSDaily from '@pages/stock-management/stock-by-location/mics-daily';
import MICSMonthly from '@pages/stock-management/stock-by-location/mics-monthly';
import StockProduct from '@pages/stock-management/stock-by-location/product';

import CustomLinkBreadcrumsComponent from '@components/CustomLinkBreadcrumsComponent';
import Loading from '@components/Loading';
import useFetchLocationById from '@hooks/location/useFetchLocationById';

const index = () => {
    const { location_id } = useParams()
    const { pathname } = useLocation();
    const segment = pathname.split('/');
    const lastSegment = segment[segment.length - 1];

    const { data: dataLocationById, isLoading: loadingDataLocationById } = useFetchLocationById(location_id)

    if(!loadingDataLocationById && !dataLocationById) {
        return 'Data Location Tidak Ditemukan!'
    }
   
    if(loadingDataLocationById){
        return <Loading />
    }
    
    return (
        <Page title='Stock By Location'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Stack spacing={1} mb={3}>
                                <Typography variant='h4'>Stock By Location - {dataLocationById.location}</Typography>
                                <Breadcrumbs sx={{ fontSize: '0.8rem' }}>
                                    <CustomLinkBreadcrumsComponent title='Stock Management' to="/stock-management" />
                                    <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">Stock By Location</Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                    <Tabs
                                        value={lastSegment}
                                        aria-label="icon position tabs example"
                                    >
                                        <Tab 
                                            icon={<Iconify icon='carbon:report' />} 
                                            iconPosition='start' 
                                            value='product' 
                                            label="Stock Per Item" 
                                            component={RouterLink}
                                            to={`/stock-management/stock-by-location/${location_id}/product`}
                                        />
                                        <Tab 
                                            icon={<Iconify icon='carbon:report' />} 
                                            iconPosition='start' 
                                            value='mics-daily' 
                                            label="MICS Daily" 
                                            component={RouterLink}
                                            to={`/stock-management/stock-by-location/${location_id}/mics-daily`}
                                        />
                                        <Tab 
                                            icon={<Iconify icon='carbon:report' />} 
                                            iconPosition='start' 
                                            value='mics-monthly' 
                                            label="MICS Monthly" 
                                            component={RouterLink}
                                            to={`/stock-management/stock-by-location/${location_id}/mics-monthly`}
                                        />
                                    </Tabs>
                                </Box>
                                {lastSegment === 'product' ?
                                    <StockProduct />
                                : null
                                }
                                {lastSegment === 'mics-daily' ?
                                    <MICSDaily />
                                : null
                                }
                                {lastSegment === 'mics-monthly' ?
                                    <MICSMonthly />
                                : null
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;