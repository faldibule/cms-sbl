import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Container, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import moment from 'moment/moment';
import CustomSearchComponent from '../../components/CustomSearchComponent';

const dummy = [
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },
    {
        name: 'login',
        description: 'login to app',
        ip: '127.0.0.1',
        browser: 'MS Edge',
        os: 'windows',
        created_at: new Date()
    },

]

const index = () => {
    const [rows, setRows] = useState(dummy);
    const [params, setParams] = useState({
        page: 0,
        limit: 5,
        search: ''
    })

    const handleChangePage = (event, newPage) => {
        setParams({
            ...params,
            page: newPage
        });
    }

    const handleChangeRowsPerPage = (event) => {
        setParams({
            ...params,
            page: 0,
            limit: parseInt(event.target.value, 10)
        })
    }

    return (
        <Page title='Activity Log'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Typography variant='h4' mb={3}>
                            Activity Log
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                    <Grid item xs={12} md={12}>
                                        <CustomSearchComponent />
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
                                                <TableCell>Log Name</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>User</TableCell>
                                                <TableCell>Ip</TableCell>
                                                <TableCell>Browser</TableCell>
                                                <TableCell>OS</TableCell>
                                                <TableCell>Created At</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(params.page * params.limit, params.page * params.limit + params.limit).map((v, i) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>{params.page * params.limit + i + 1}</TableCell>
                                                        <TableCell>{v.name}</TableCell>
                                                        <TableCell>{v.description}</TableCell>
                                                        <TableCell>-</TableCell>
                                                        <TableCell>{v.ip}</TableCell>
                                                        <TableCell>{v.browser}</TableCell>
                                                        <TableCell>{v.os}</TableCell>
                                                        <TableCell>{moment(v.created_at).format('LL')}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={rows.length}
                                    page={params.page}
                                    rowsPerPage={params.limit}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[1, 5, 25, 50]}
                                    showFirstButton
                                    showLastButton
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </Container>
        </Page>
    );
};
export default index;