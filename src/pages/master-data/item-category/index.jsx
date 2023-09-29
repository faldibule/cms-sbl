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
import Loading from '@components/Loading';

let dummy = []
for(let i = 0; i < 15; i++){
    dummy[i] = {
        code: i + 1,
        name: `Item Category ${i + 1}`,
        brand:  `Brand 1`,
        size: 'Size 1',
        tax: i % 2 === 0 ? true : false
    }
}

const index = () => {
    const [data, setData] = useState({
        code: ''
    })
    const [loading, setLoading] = useState(false)
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
    const getData = () => new Promise(resolve => setTimeout(() => {
        resolve('done')
        setData({
            code: '12321',
            email: 'test@gmail.com',
            status: '1',
        })
    }, 500))
    const handleEdit = async () => {
        console.log(staging)
        handleMenu()
        setLoading(true)
        setTimeout(() => {
            setData({
                code: 'udin',
            })
            setLoading(false)
        }, 500);
        // try {
        //     const res = await getData()
        // } catch (err) {
        //     console.log(err)
        // } finally {
        //     setLoading(false)
        // }
    }

    return (
        <Page title='Item Category'>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                Item Category
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
                                                {/* <TableCell>Brand</TableCell> */}
                                                {/* <TableCell>Size</TableCell> */}
                                                <TableCell>Tax</TableCell>
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
                                                        {/* <TableCell>{v.brand}</TableCell> */}
                                                        {/* <TableCell>{v.size}</TableCell> */}
                                                        <TableCell>
                                                            {v.tax ? 'Yes' : 'No'}
                                                        </TableCell>
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
                            <Typography mb={3} variant='h6'>Form Item Category</Typography>
                            {!loading ? 
                                <Stack rowGap={2}>
                                    <TextField
                                        fullWidth 
                                        label='Code'
                                        defaultValue={data.code}
                                    /> 
                                    <TextField
                                        fullWidth 
                                        label='Name'
                                    /> 
                                    <TextField
                                        fullWidth 
                                        label='Brand'
                                        select
                                    >
                                        <MenuItem value='1'>Brand 1</MenuItem>
                                        <MenuItem value='2'>Brand 2</MenuItem>
                                    </TextField> 
                                    <TextField
                                        fullWidth 
                                        label='Size'
                                    /> 
                                    <TextField
                                        fullWidth 
                                        label='Unit'
                                        select
                                    >
                                        <MenuItem value=''>None</MenuItem>
                                        <MenuItem value='kg'>KG</MenuItem>
                                        <MenuItem value='grm'>GRM</MenuItem>
                                        <MenuItem value='tin'>TIN</MenuItem>
                                        <MenuItem value='btl'>BTL</MenuItem>
                                        <MenuItem value='btl'>LTR</MenuItem>
                                        <MenuItem value='btl'>TUB</MenuItem>
                                        <MenuItem value='btl'>BAG</MenuItem>
                                        <MenuItem value='btl'>EA</MenuItem>
                                        <MenuItem value='btl'>BOX</MenuItem>
                                        <MenuItem value='btl'>CTN</MenuItem>
                                        <MenuItem value='btl'>GLN</MenuItem>
                                        <MenuItem value='btl'>ROLL</MenuItem>
                                        <MenuItem value='btl'>SLOP</MenuItem>
                                        <MenuItem value='btl'>PPN</MenuItem>
                                        <MenuItem value='btl'>SISIR</MenuItem>
                                        <MenuItem value='btl'>LOT</MenuItem>
                                    </TextField> 
                                    <TextField
                                        fullWidth 
                                        label='Tax'
                                        select
                                    >
                                        <MenuItem value='1'>Yes</MenuItem>
                                        <MenuItem value='2'>No</MenuItem>
                                    </TextField> 
                                    <LoadingButton variant='contained' type='submit'>
                                        submit
                                    </LoadingButton>
                                </Stack>
                            : <Loading />
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <CustomMenuComponent 
                            handleEdit={handleEdit}
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