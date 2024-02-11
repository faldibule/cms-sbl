import Loading from '@components/Loading';
import Page from '@components/Page';
import useFetchRole from '@hooks/role/useFetchRole';
import { Card, CardContent, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const dataRoleDummy = [
    {
        id: 'super-admin',
        label: 'Super Admin',
    },
    {
        id: 'bod',
        label: 'BOD',
    },
    {
        id: 'operation',
        label: 'Operation',
    },
    {
        id: 'purchasing',
        label: 'Purchasing',
    },
    {
        id: 'camp-boss',
        label: 'Camp Boss',
    },
    {
        id: 'finance',
        label: 'Finance',
    },
]

const index = () => {
    const navigate = useNavigate()
    const [params, setParams] = useState({
        page: 0,
        limit: 5,
        search: ''
    })
    const { data: rows, isLoading } = useFetchRole(params)

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

    const renderData = useCallback(() => {
        if(rows === undefined) {
            return (
                <TableRow>
                    <TableCell
                        component="th"
                        scope="row"
                        sx={{
                            textAlign: "center",
                            py: 5,
                        }}
                        colSpan={10}
                    >
                        <Loading />
                    </TableCell>
                </TableRow>
            )
        } 
        if(rows.length === 0){
            return (
                <TableRow>
                    <TableCell
                        component="th"
                        scope="row"
                        sx={{
                            textAlign:
                                "center",
                            py: 10,
                        }}
                        colSpan={10}
                    >
                        No result found
                        {params.search !==
                            "" && (
                            <div
                                style={{
                                    display:
                                        "inline-block",
                                }}
                            >
                                &nbsp;for "<b>{params.search}</b>"
                            </div>
                        )}
                        .
                    </TableCell>
                </TableRow>
            )
        }
        return rows.slice(params.page * params.limit, params.page * params.limit + params.limit).map((v, i) => {
            const label = v.name.replaceAll('-', ' ')
            return (
                <TableRow key={i}>
                    <TableCell>{params.page * params.limit + i + 1}</TableCell>
                    <TableCell>{label}</TableCell>
                </TableRow>
            )
        })
    }, [rows])

    if(isLoading){
        return <Loading />
    }

    return (
        <Page title='User Role'>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                            <Typography variant='h4' mb={3}>
                                User Role
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card>
                            <CardContent>
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
                                                <TableCell>Role Name</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {renderData()}
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