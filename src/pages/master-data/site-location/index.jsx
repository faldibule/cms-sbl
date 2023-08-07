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

let dummy = []
for(let i = 0; i < 15; i++){
    dummy[i] = {
        code: i + 1,
        name: `Location ${i + 1}`,
        parent: i % 2 === 0 ? null : 'DKI Jakarta'
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
        <Page title='Site Location'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Site Location
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
                                                <TableCell>Code</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Parent</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(params.page * params.limit, params.page * params.limit + params.limit).map((v, i) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>{params.page * params.limit + i + 1}</TableCell>
                                                        <TableCell sx={{ color: 'blue', cursor: 'pointer' }}>{v.code}</TableCell>
                                                        <TableCell>{v.name}</TableCell>
                                                        <TableCell>{!!v.parent ? v.parent : '-'}</TableCell>
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
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2 }}>
                            <Typography mb={3} variant='h6'>Form Site Location</Typography>
                            <Stack rowGap={2}>
                                <TextField
                                    fullWidth 
                                    label='Code'
                                /> 
                                <TextField
                                    fullWidth 
                                    label='Location Name'
                                /> 
                                <TextField
                                    fullWidth 
                                    label='parent'
                                    select
                                >
                                    <MenuItem value='1'>parent 1</MenuItem>
                                    <MenuItem value='2'>parent 2</MenuItem>
                                </TextField> 
                                <LoadingButton variant='contained' type='submit'>
                                    submit
                                </LoadingButton>
                            </Stack>
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