import Iconify from '@components/Iconify';
import { Box, Card, Container, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, } from 'react-router-dom';
import MonthlyReport from './MonthlyReport';
import Sales from './sales';

const index = () => {
    const { pathname } = useLocation();
    const segment = pathname.split('/');
    const lastSegment = segment[segment.length - 1];
    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Typography variant='h4'>Report Monthly</Typography>
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
                                    value='report-monthly'  
                                    label="Summary, MOR, RPR" 
                                    component={RouterLink}
                                    to={`/report/report-monthly`}
                                />
                                <Tab 
                                    icon={<Iconify 
                                    icon='carbon:report' />} 
                                    iconPosition='start' 
                                    value='sales' 
                                    label="Sales Report" 
                                    component={RouterLink}
                                    to={`/report/sales`}
                                />
                            </Tabs>
                        </Box>
                        {lastSegment === 'report-monthly' ?
                            <MonthlyReport />
                        : null
                        }
                        {lastSegment === 'sales' ?
                            <Sales />
                        : null
                        }
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default index