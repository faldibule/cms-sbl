import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import Page from "@components/Page";
import Iconify from "@components/Iconify";
import CustomSearchComponent from "@components/CustomSearchComponent";
import CustomLinkComponent from "@components/CustomLinkComponent";
import Loading from "@components/Loading";
import useFetchUser from "@hooks/user-list/useFetchUser";
import { useRecoilValue } from "recoil";
import { authentication } from "@recoil/Authentication";

const index = () => {
    const { user } = useRecoilValue(authentication)
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: "",
        paginate: 1,
        role: "",
        status: [],
        department_id: [],
        location_id: [],
    });
    const {
        data: rows,
    } = useFetchUser(params)

    const handleChangePage = (event, newPage) => {
        setParams((prev) => {
            return {
                ...prev,
                page: newPage + 1,
            };
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setParams((prev) => {
            return {
                ...prev,
                page: 1,
                limit: +event.target.value,
            };
        });
    };

    const handleDelete = async (id) => {
        try {
            
        } catch (err) {
            // console.log(err.response)
            
        }
    }

    const filteredData = useMemo(() => {
        if(!!!rows) return undefined
        const tempData = rows.data.filter(v => v.id !== user?.id)
        return {
            ...rows,
            data: tempData
        }
        
    }, [rows])

    const renderData = useCallback(() => {
        if(filteredData === undefined) {
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
        if(filteredData.data.length === 0){
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
        return filteredData.data.map((value, key) => {
            if(value.id === user?.id) return
            return (
                <TableRow key={key}>
                    <TableCell
                        component="th"
                        scope="row"
                        align="center"
                    >
                        {filteredData.meta.from+key}.
                    </TableCell>
                    <TableCell>
                        <CustomLinkComponent 
                            label={value.name}
                            url={`/user/user-list/edit/${value.id}`}
                        />
                    </TableCell>
                    <TableCell>
                        {value.email}
                    </TableCell>
                    <TableCell>
                        {value.role}
                    </TableCell>
                    <TableCell>
                        {value.department.department}
                    </TableCell>
                    <TableCell>
                        {value.location.location}
                    </TableCell>
                    <TableCell>
                        {value.status === 'active' ? 
                            <Iconify icon='material-symbols:check-circle' sx={{ color: 'green', fontSize: 20 }} />
                        :
                            <Iconify icon='carbon:close-filled' sx={{ color: 'red', fontSize: 20 }} />
                        }
                    </TableCell>
                    {/* <TableCell>
                        <CustomActionTableComponent 
                            handleDelete={() => handleDelete(value.id)}
                        />
                    </TableCell>                                                              */}
                </TableRow>
            )
        })
    }, [rows])

    return (
        <Page title="User List">
            <Container>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        md={12}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography
                                variant="h4"
                                mb={3}
                            >
                                User List
                            </Typography>
                            <Button
                                component={Link}
                                to="/user/user-list/add"
                                variant="contained"
                                startIcon={
                                    <Iconify icon="material-symbols:add" />
                                }
                            >
                                Add User
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                    >
                        <Card>
                            <CardContent>
                                <Grid
                                    container
                                    spacing={2}
                                    sx={{ mb: 2 }}
                                    alignItems="center"
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        md={12}
                                    >
                                        <CustomSearchComponent search={params.search} setParams={setParams} params={params} />
                                    </Grid>
                                </Grid>
                                <TableContainer>
                                    <Table
                                        sx={{ minWidth: 650 }}
                                        aria-label="simple table"
                                    >
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": {
                                                        borderRadius:
                                                            "0.5em 0 0 0.5em",
                                                    },
                                                    "& th:last-of-type": {
                                                        borderRadius:
                                                            "0 0.5em 0.5em 0",
                                                    },
                                                }}
                                            >
                                                <TableCell>No.</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Role</TableCell>
                                                <TableCell>Department</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Status</TableCell>
                                                {/* <TableCell>Action</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {renderData()}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {filteredData !== undefined && filteredData.data.length > 0 && (
                                    <TablePagination
                                        component="div"
                                        count={filteredData.meta.total - 1}
                                        page={params.page - 1}
                                        rowsPerPage={params.limit}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage
                                        }
                                        rowsPerPageOptions={[
                                            1, 5, 10, 25, 50, 100,
                                        ]}
                                        showFirstButton
                                        showLastButton
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};
export default index;
