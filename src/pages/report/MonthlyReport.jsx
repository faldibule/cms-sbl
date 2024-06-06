import Page from '@components/Page';
import useDownloadReport from '@hooks/report/useDownloadReport';
import { LoadingButton } from '@mui/lab';
import { Card, CardContent, Container, Grid, MenuItem, TextField } from '@mui/material';

const dataMonth = [
    { month: 'Januari', value: 1 },
    { month: 'Februari', value: 2 },
    { month: 'Maret', value: 3 },
    { month: 'April', value: 4 },
    { month: 'Mei', value: 5 },
    { month: 'Juni', value: 6 },
    { month: 'Juli', value: 7 },
    { month: 'Agustus', value: 8 },
    { month: 'September', value: 9 },
    { month: 'Oktober', value: 10 },
    { month: 'November', value: 11 },
    { month: 'Desember', value: 12 },
];

const reportType = [
    {
        label: 'SUMMARY PHYSICAL INVENTORY',
        url: 'export/summary-excel',
    },
    {
        label: 'REALISASI PURCHASE RECORD',
        url: 'export/realisasi-purchase-record-excel',
    },
    {
        label: 'MOR',
        url: 'export/real-mor-excel',
    },
]

const getYearList = () => {
    const currentYear = new Date().getFullYear();
    const yearsBefore = [currentYear - 3, currentYear - 2, currentYear - 1];
    const yearList = [...yearsBefore, currentYear];

    return yearList;
};
const MonthlyReport = () => {
    const { mutate: download, isLoading, error } = useDownloadReport({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `${res.params.label}.xlsx`); 
            document.body.appendChild(link);
            link.click();
        },
    })
    const errors = error?.response?.data?.errors

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const temp = Object.fromEntries(formData)
        formData.append('label', reportType.find((v) => v.url === temp.report_type).label)
        const params = Object.fromEntries(formData)
        download(params)
    }
    return (
        <Page title='Report'>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Card>
                            <CardContent>
                                <Grid alignItems='center' container spacing={2} component='form' onSubmit={onSubmit}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth 
                                            label='Report Type'
                                            name='report_type'
                                            defaultValue=''
                                            required
                                            select
                                        >
                                            {reportType.map((v, i) => {
                                                return (
                                                    <MenuItem key={v.url} value={v.url}>{v.label}</MenuItem>
                                                )
                                            })}
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth 
                                            label='Month'
                                            name='month'
                                            defaultValue=''
                                            required
                                            helperText={!!errors?.month && errors?.month[0]}
                                            error={!!errors?.month}
                                            select
                                        >
                                            {dataMonth.map((v, i) => {
                                                return (
                                                    <MenuItem key={v.value} value={v.value}>{v.month}</MenuItem>
                                                )
                                            })}
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth 
                                            label='Year'
                                            name='year'
                                            defaultValue=''
                                            required
                                            helperText={!!errors?.year && errors?.year[0]}
                                            error={!!errors?.year}
                                            select
                                        >
                                            {getYearList().map((v, i) => {
                                                return (
                                                    <MenuItem key={v} value={v}>{v}</MenuItem>
                                                )
                                            })}
                                        </TextField> 
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <LoadingButton type='submit' fullWidth variant='contained' loading={isLoading}>Export</LoadingButton>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        
                    </Grid>
                </Grid>
            </Container>
        </Page>
    )
}

export default MonthlyReport