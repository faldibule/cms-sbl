import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Checkbox, Container, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Page from '../../../../components/Page';
import Iconify from '../../../../components/Iconify';
import moment from 'moment/moment';
import CustomSearchComponent from '../../../../components/CustomSearchComponent';
import CustomStatusLabelComponent from '../../../../components/CustomStatusLabelComponent';
import CustomMenuComponent from '../../../../components/CustomMenuComponent';
import { LoadingButton } from '@mui/lab';
import CustomActionTableComponent from '@components/CustomActionTableComponent';

let dummy = []
for(let i = 0; i < 15; i++){
    dummy[i] = {
        code: i + 1,
        name: `Nama ${i + 1}`,
        position: i % 2 === 0 ? 'Diver' : 'EMT',
        company: `Company ${i + 1}`,
        b: true,
        l: true,
        d: true,
        s: true,
        c: true,
        a: true,
        accom: true
    }
}

const CheckStatusComponent = ({ data }) => {
    if(data){
        return <Iconify icon='mdi:check-bold' sx={{ color: 'green', fontSize: '1rem' }} />
    }
    return <Iconify icon='mingcute:close-fill' sx={{ color: 'red', fontSize: '1rem' }} />

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
        <Page title='Meal Sheet Daily'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Meal Sheet Daily
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
                                <TableContainer sx={{ maxWidth: 1000, overflowX: 'auto' }}>
                                    <Table sx={{ minWidth: 1000 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                }}
                                            >
                                                <TableCell>No.</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Position</TableCell>
                                                <TableCell>Company</TableCell>
                                                <TableCell align='center'>Breakfast</TableCell>
                                                <TableCell align='center'>Lunch</TableCell>
                                                <TableCell align='center'>Dinner</TableCell>
                                                <TableCell align='center'>Super</TableCell>
                                                <TableCell align='center'>Casual</TableCell>
                                                <TableCell align='center'>Acomodation</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(params.page * params.limit, params.page * params.limit + params.limit).map((v, i) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>{params.page * params.limit + i + 1}</TableCell>
                                                        <TableCell>{v.name}</TableCell>
                                                        <TableCell>{v.position}</TableCell>
                                                        <TableCell>{v.company}</TableCell>
                                                        <TableCell align='center'>
                                                            <CheckStatusComponent data={v.b} />
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <CheckStatusComponent data={v.l} />
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <CheckStatusComponent data={v.d} />
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <CheckStatusComponent data={v.s} />
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <CheckStatusComponent data={v.c} />
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <CheckStatusComponent data={v.a} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <CustomActionTableComponent 
                                                                edit={true}
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
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2 }}>
                            <Typography mb={3} variant='h6'>Form Meal Sheet Daily</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={126}>
                                    <TextField
                                        fullWidth 
                                        label='Nama'
                                    /> 
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        fullWidth 
                                        label='Position'
                                        select
                                    >
                                        <MenuItem value='1'>Position 1</MenuItem>
                                        <MenuItem value='2'>Position 2</MenuItem>
                                    </TextField> 
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        fullWidth 
                                        label='Company'
                                        select
                                    >
                                        <MenuItem value='1'>Company 1</MenuItem>
                                        <MenuItem value='2'>Company 2</MenuItem>
                                    </TextField> 
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormGroup sx={{ display: 'flex', ml: 1, justifyContent: { xs: 'space-evenly', md: 'inherit' }}} row={true}>
                                        <FormControlLabel control={<Checkbox  />} label="Breakfast" />
                                        <FormControlLabel control={<Checkbox  />} label="Lunch" />
                                        <FormControlLabel control={<Checkbox  />} label="Casual" />
                                    </FormGroup>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormGroup sx={{ display: 'flex', ml: 1, justifyContent: { xs: 'space-evenly', md: 'inherit' }}} row={true}>
                                        <FormControlLabel control={<Checkbox  />} label="Dinner" />
                                        <FormControlLabel control={<Checkbox  />} label="Super" />
                                        <FormControlLabel control={<Checkbox  />} label="Acomodation" />
                                    </FormGroup>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <LoadingButton fullWidth variant='contained' type='submit'>
                                        submit
                                    </LoadingButton>
                                </Grid>
                            </Grid>
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