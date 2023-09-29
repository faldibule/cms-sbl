import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Container, Grid, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '@components/Page';
import Iconify from '@components/Iconify';
import moment from 'moment/moment';
import CustomSearchComponent from '@components/CustomSearchComponent';
import CustomStatusLabelComponent from '@components/CustomStatusLabelComponent';
import CustomLinkComponent from '@components/CustomLinkComponent';

let dummy = []
for(let i = 1; i <= 10; i++){
    dummy.push({
        quotation_number: '123' + i,
        customer_name: `Customer ${i}`,
        shipment_date: new Date(),
        user: `user ${i}`,
        status: i % 2 === 0 ? 'pending' : 'approved',
    })
}
const index = () => {
    const navigate = useNavigate()
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
        <Page title='Quotation'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Quotation
                            </Typography>
                            <Button onClick={() => navigate('/quotation/add')} variant='contained' startIcon={<Iconify icon='ic:baseline-plus'  />}>
                                Input
                            </Button>
                        </Stack>
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
                                                <TableCell>PR Number</TableCell>
                                                <TableCell>Customer Name</TableCell>
                                                <TableCell>Shipment Date</TableCell>
                                                <TableCell>Prepared By</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(params.page * params.limit, params.page * params.limit + params.limit).map((v, i) => {
                                                const { status } = v
                                                let statusLabel = {
                                                    title: 'default',
                                                    color: 'white',
                                                    bgcolor: 'green'
                                                }
                                                if(status === 'approved') statusLabel = { title: 'Approve', color: 'white', bgcolor: 'green' }
                                                if(status === 'pending') statusLabel = { title: 'Pending', color: 'black', bgcolor: 'yellow' }
                                                if(status === 'rejected') statusLabel = { title: 'Rejected', color: 'white', bgcolor: 'red' }
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>{params.page * params.limit + i + 1}</TableCell>
                                                        <TableCell>
                                                            <CustomLinkComponent label={v.quotation_number} url='/quotation/edit/1' />
                                                        </TableCell>
                                                        <TableCell>{v.customer_name}</TableCell>
                                                        <TableCell>{moment(v.shipment_date).format('LL')}</TableCell>
                                                        <TableCell>{v.user}</TableCell>
                                                        <TableCell>
                                                            <CustomStatusLabelComponent 
                                                                title={statusLabel.title}
                                                                color={statusLabel.color}
                                                                bgcolor={statusLabel.bgcolor}
                                                            />
                                                        </TableCell>
                                                        
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