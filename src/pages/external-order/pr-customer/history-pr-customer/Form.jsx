import CustomGrandTotalComponent from '@components/CustomGrandTotalComponent'
import CustomLinkBreadcrumsComponent from '@components/CustomLinkBreadcrumsComponent'
import TableCellHeaderColor from '@components/TableCellHeaderColor'
import TableInputRow from '@components/pr-catering/TableInputRow'
import { Box, Breadcrumbs, Card, Grid, InputAdornment, Stack, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'

const Form = (props) => {
    const { data } = props.data
    
    return (
        <Stack>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Stack>
                            <Typography variant='h5'>
                                Detail History PR Customer - {data.pr_number}
                            </Typography>
                            <Breadcrumbs sx={{ fontSize: '0.8rem', mt: 1 }}>
                                <CustomLinkBreadcrumsComponent title='PR Customer' to="/external-order/pr-customer" />
                                <CustomLinkBreadcrumsComponent title='History PR Customer' to={`/external-order/history-pr-customer/${props.data.reference_id}`} />
                                <Typography sx={{ fontSize: '0.8rem' }}  color="text.primary">Detail History PR Customer</Typography>
                            </Breadcrumbs>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>

            <Box>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <TextField 
                                fullWidth
                                label='Location'
                                defaultValue={data.location.location}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                disabled={true}
                                label="Request Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                defaultValue={data?.request_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type='date'
                                disabled={true}
                                name='delivery_date'
                                label="Delivery Date"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                                defaultValue={data?.delivery_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField 
                                fullWidth
                                label='Prepared By'
                                defaultValue={data.prepared_by.name}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField 
                                fullWidth
                                label='Description'
                                defaultValue={data.description}
                                disabled={true}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {data.item_product.length > 0 ? 
                                <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                    <Table stickyHeader aria-label="simple table">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                                    "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                                    bgcolor: '#d6e9ff'
                                                }}
                                            >
                                                <TableCellHeaderColor>No.</TableCellHeaderColor>
                                                <TableCellHeaderColor>Item Name</TableCellHeaderColor>
                                                <TableCellHeaderColor>Item Brand</TableCellHeaderColor>
                                                <TableCellHeaderColor>Description</TableCellHeaderColor>
                                                <TableCellHeaderColor>Size</TableCellHeaderColor>
                                                <TableCellHeaderColor>Unit</TableCellHeaderColor>
                                                <TableCellHeaderColor>Price</TableCellHeaderColor>
                                                <TableCellHeaderColor>Quantity</TableCellHeaderColor>
                                                <TableCellHeaderColor>VAT</TableCellHeaderColor>
                                                <TableCellHeaderColor>Tax</TableCellHeaderColor>
                                                <TableCellHeaderColor>Total Price</TableCellHeaderColor>
                                                <TableCellHeaderColor>Grand Total</TableCellHeaderColor>
                                                <TableCellHeaderColor>Remarks</TableCellHeaderColor>
                                                <TableCellHeaderColor>Action</TableCellHeaderColor>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.item_product.map((v, i) => <TableInputRow isApproved={true} errors={{}} key={i} i={i} v={v} /> )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            : 
                            null
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <CustomGrandTotalComponent item={data.item_product} />
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Stack>
    )
}

export default Form