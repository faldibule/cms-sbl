import { useCallback, useState } from 'react'
import { useNavigate, useParams, Link as RouterLink, useLocation, } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Container, Grid, IconButton, InputAdornment, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import Iconify from '@components/Iconify';
import Loading from '@components/Loading';

import StockMor from '@pages/stock-management/stock-by-location/mor/index'
import StockProduct from '@pages/stock-management/stock-by-location/product/index'


const index = () => {
    const navigate = useNavigate()
    const { location_id } = useParams()
    const { pathname } = useLocation();
    const segment = pathname.split('/');
    const lastSegment = segment[segment.length - 1];
    
    return (
        <Page title='Stock By Location'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Stock By Location
                            </Typography>
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
                                            label="Manual Stock" 
                                            component={RouterLink}
                                            to={`/stock-management/stock-by-location/${location_id}/product`}
                                        />
                                        <Tab 
                                            icon={<Iconify icon='carbon:report' />} 
                                            iconPosition='start' 
                                            value='mor' 
                                            label="MOR" 
                                            component={RouterLink}
                                            to={`/stock-management/stock-by-location/${location_id}/mor`}
                                        />
                                    </Tabs>
                                </Box>
                                {lastSegment === 'product' ?
                                    <StockProduct />
                                : null
                                }
                                {lastSegment === 'mor' ?
                                    <StockMor />
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