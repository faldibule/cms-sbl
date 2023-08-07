import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Checkbox, Container, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import moment from 'moment/moment';
import CustomSearchComponent from '../../../components/CustomSearchComponent';
import CustomStatusLabelComponent from '../../../components/CustomStatusLabelComponent';
import CustomMenuComponent from '../../../components/CustomMenuComponent';
import { LoadingButton } from '@mui/lab';
import { NumberFormat } from '../../../utils/Format';

let dummy = []
for(let i = 0; i < 15; i++){
    dummy[i] = {
        discount: i % 2 === 0 ? 20 : 0,
    }
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

    const [staging, setStaging] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event, value) => {
        setAnchorEl(event.currentTarget);
        setStaging(value);
    };
    const handleMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Page title='Pricelist'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Pricelist
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                    <Grid item xs={12} md={12}>
                                        <CustomSearchComponent />
                                    </Grid>
                                </Grid>
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                }}
                                            >
                                                <TableCell>No.</TableCell>
                                                <TableCell>Discount</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(params.page * params.limit, params.page * params.limit + params.limit).map((v, i) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>{params.page * params.limit + i + 1}</TableCell>
                                                        <TableCell>{v.discount === 0 ? `${v.discount}%` : 'none'}</TableCell>
                                                        <TableCell>
                                                            <IconButton onClick={(e) => handleClick(e, v)}>
                                                                <Iconify icon='mingcute:more-2-fill' />
                                                            </IconButton>
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
                    <Grid item xs={12} md={12}>
                        <CustomMenuComponent 
                            anchorEl={anchorEl}
                            open={open}
                            handleMenu={handleMenu}
                        />
                    </Grid>
                </Grid>

            </Container>
        </Page>
    );
};
export default index;