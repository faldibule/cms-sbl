import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Container, Grid, Link, Stack, Tab, Tabs, Typography } from '@mui/material';
import Page from '@components/Page';
import { useState } from 'react';
import MealSheetDaily from '../meal-sheet-daily'
import MealSheetMonthly from '../meal-sheet-monthly'
import Iconify from '@components/Iconify';
import { CapitalizeFirstLetter } from '@utils/Format';

const index = () => {
    const { group_id } = useParams()
    const { pathname } = useLocation();
    const segment = pathname.split('/');
    const lastSegment = segment[segment.length - 1];
   
    return (
        <Page title={`Meal Sheet ${CapitalizeFirstLetter(lastSegment)}`}f>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Stack spacing={1} mb={3}>
                                <Typography variant='h4'>Meal Sheet Report</Typography>
                                <Breadcrumbs sx={{ fontSize: '0.8rem' }}>
                                    <Link underline="hover" color="inherit" href="/meal-sheet/group">Meal Sheet Group</Link>
                                    <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">Meal Sheet Report</Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Card sx={{ p: 2 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                <Tabs
                                    value={lastSegment}
                                    aria-label="icon position tabs example"
                                >
                                    <Tab 
                                        icon={<Iconify icon='carbon:report' />} 
                                        iconPosition='start' 
                                        value='daily' 
                                        label="Daily" 
                                        component={RouterLink}
                                        to={`/meal-sheet/report/${group_id}/daily`}
                                    />
                                    <Tab 
                                        icon={<Iconify 
                                        icon='carbon:report' />} 
                                        iconPosition='start' 
                                        value='monthly' 
                                        label="Monthly" 
                                        component={RouterLink}
                                        to={`/meal-sheet/report/${group_id}/monthly`}
                                    />
                                </Tabs>
                            </Box>
                            {lastSegment === 'daily' ?
                                <MealSheetDaily />
                            : null
                            }
                            {lastSegment === 'monthly' ?
                                <MealSheetMonthly />
                            : null
                            }
                        </Card>
                    </Grid>
                    
                   
                </Grid>
            </Container>
        </Page>
    );
};
export default index;