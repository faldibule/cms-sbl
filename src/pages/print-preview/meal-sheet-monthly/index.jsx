import Iconify from '@components/Iconify'
import Loading from '@components/Loading'
import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import moment from 'moment'
import 'moment/locale/id';
import { LoadingButton } from '@mui/lab'
import useDownloadMealSheetMonthly from '@hooks/meal-sheet-monthly/useDownloadMealSheetMonthly'
import useFetchMealSheetMonthlyById from '@hooks/meal-sheet-monthly/useFetchMealSheetMonthlyById'

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

const PreviewMonthlyRecord = () => {
    const { id } = useParams()
    const { data: rows, isLoading: loadingData } = useFetchMealSheetMonthlyById(id)
    
    const valueMemo = useMemo(() => {
        if(!!!rows && !loadingData) return []
        let tempObject = {
            total_onboard_actual: 0,
            total_as_per_contract: 0,
            total_casual_breakfast: 0,
            total_casual_lunch: 0,
            total_casual_dinner: 0,
            total_super: 0,
            total_total: 0,
            total_client_group: rows?.meal_sheet_group?.client,
        }
        rows?.recap_per_day.forEach((v, i) => {
            tempObject = {
                ...tempObject,
                total_onboard_actual: tempObject.total_onboard_actual + v.onboard_actual,
                total_as_per_contract: tempObject.total_as_per_contract + v.as_per_contract,
                total_casual_breakfast: tempObject.total_casual_breakfast + v.casual_breakfast,
                total_casual_lunch: tempObject.total_casual_lunch + v.casual_lunch,
                total_casual_dinner: tempObject.total_casual_dinner + v.casual_dinner,
                total_super: tempObject.total_super + v.super,
                total_total: tempObject.total_total + v.total,
            }
            v?.client_group.forEach((client, index) => {
                const temp = tempObject.total_client_group.map((value, i) => {
                    if(value.id === client.id){
                        return {
                            ...value,
                            mandays: (value?.mandays || 0) + client.mandays
                        }
                    }
                    return value
                })
                tempObject = {
                    ...tempObject,
                    total_client_group: temp,
                }
            })
        })
        return tempObject
    }, [rows, loadingData])

    if(loadingData){
        return 'Loading ...'
    }

    return (
        <table className="tg" style={{ minWidth: '700px' }}>
            <thead>
                <tr>
                    <th className="tg-c3ow" colSpan="12">
                        <h1>PT.Surya Buana Lestarijaya</h1>
                        <b>Catering and Accomodation Service</b>
                    </th>
                </tr>
            </thead>
            <tbody>
                {/* Kop Surat */}
                <tr>
                    <td className="tg-7btt" colspan="12" style={{ borderBottom: 'none' }}>
                        <h2>Summary Meal Count Sheet</h2>
                    </td>
                </tr>
                <tr>
                    <td className="tg-sn4r" colspan="3" style={{ borderRight: 'none' }}> Location : {rows?.meal_sheet_group?.location?.location} </td>
                    <td className="tg-de2y" style={{ borderLeft: 'none', borderRight: 'none', }}></td>
                    <td className="tg-dvpl" colspan="8" style={{ borderLeft: 'none' }}>MONTH: {dataMonth.find(v => v.value === rows?.month).month} {rows?.year}</td>
                </tr>

                {/* Header */}
                <tr>
                    <td className="tg-baqh" rowspan="2" style={{ verticalAlign: 'middle', }}>Date</td>
                    <td className="tg-baqh" colspan={rows?.meal_sheet_group?.client?.length}>Client Group</td>
                    <td className="tg-baqh" colspan="2">Total Account</td>
                    <td className="tg-baqh" colspan="3">Casual Meals</td>
                    <td className="tg-0lax"></td>
                    <td className="tg-0lax"></td>
                    <td className="tg-0lax" colspan="2" rowspan="2" style={{ verticalAlign: 'middle', textAlign: 'center', }}>Remark</td>
                </tr>
                <tr>
                    {rows?.meal_sheet_group?.client?.map((v, i) => {
                        return (
                            <td key={i} className="tg-0lax">{v.client_name}</td>
                        )
                    })}
                    <td className="tg-0lax">Onboard Actual</td>
                    <td className="tg-0lax">As Per Contract</td>
                    <td className="tg-0lax">Breakfast</td>
                    <td className="tg-0lax">Lunch</td>
                    <td className="tg-0lax">Dinner</td>
                    <td className="tg-0lax">Supper</td>
                    <td className="tg-0lax">Total</td>
                </tr>

                {/* Content */}
                {rows?.recap_per_day?.map((v, i) => {
                    return (
                        <tr key={i+1}>
                            <td className="text-center">{moment(v.meal_sheet_date).format('D')}</td>
                            {v?.client_group?.map((client, j) => {
                                return (
                                    <td className="text-center">{client?.mandays}</td>
                                )
                            })}
                            <td className="text-center">{ v?.onboard_actual }</td>
                            <td className="text-center">{ v?.as_per_contract }</td>
                            <td className="text-center">{ v?.casual_breakfast }</td>
                            <td className="text-center">{ v?.casual_lunch }</td>
                            <td className="text-center">{ v?.casual_dinner }</td>
                            <td className="text-center">{ v?.super }</td>
                            <td className="text-center">{ v?.total }</td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                        </tr>
                    )
                })}
                <tr>
                    <td className="text-center">Total</td>
                    {valueMemo.total_client_group.map((total_client, i) => {
                        return (
                            <td key={i} className="text-center">{total_client.mandays}</td>
                        )
                    })}
                    <td className="text-center">{valueMemo.total_onboard_actual}</td>
                    <td className="text-center">{valueMemo.total_as_per_contract}</td>
                    <td className="text-center">{valueMemo.total_casual_breakfast}</td>
                    <td className="text-center">{valueMemo.total_casual_lunch}</td>
                    <td className="text-center">{valueMemo.total_casual_dinner}</td>
                    <td className="text-center">{valueMemo.total_super}</td>
                    <td className="text-center">{valueMemo.total_total}</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                </tr>                
                
                
                {/* Divider */}
                <tr style={{ lineHeight: '10px', padding: '0' }}>
                    <td colspan="12"></td>
                </tr>
                
                {/* Signature */}
                <tr>
                    <td colspan="2" style={{ borderTop: 'none', borderRight: 'none', }}>
                        <div style={{ minHeight: '100px', textAlign: 'center', marginTop: '-5px', }}>
                            <p>Prepared By,</p>
                            <p style={{ marginTop: '60px', }}>{rows.prepared_by['name']}</p>
                            <p style={{ marginTop: '-5px', marginBottom: '0px', }}>{rows.prepared_by['position']}</p>
                        </div>
                    </td>
                    <td colspan="4" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                        <div style={{ minHeight: '100px', textAlign: 'center', marginTop: '-5px', }}>
                            <p>Checked By,</p>
                            <p style={{ marginTop: '60px', }}>{rows.checked_by['name']}</p>
                            <p style={{ marginTop: '-5px', marginBottom: '0px', }}>{rows.checked_by['position']}</p>
                        </div>
                    </td>
                    <td colspan="3" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                        <div style={{ marginLeft: '-50px', minHeight: '100px', textAlign: 'center', marginTop: '-5px', }}>
                            <p>Approved By,</p>
                            <p style={{ marginTop: '60px', }}>{rows.approved_by['name']}</p>
                            <p style={{ marginTop: '-5px', marginBottom: '0px', }}>{rows.approved_by['position']}</p>
                        </div>
                    </td>
                    <td colspan="3" style={{ borderTop: 'none', borderLeft: 'none', }}>
                        <div style={{ minHeight: '100px', textAlign: 'center', marginTop: '-5px', }}>
                            <p>Acknowledge By,</p>
                            <p style={{ marginTop: '60px', }}>{rows.acknowladge_by['name']}</p>
                            <p style={{ marginTop: '-5px', marginBottom: '0px', }}>{rows.acknowladge_by['position']}</p>
                        </div>
                    </td>
                </tr>

                {/* Footer */}
                <tr style={{ lineHeight: '10px', padding: 0, }}>
                    <td colspan="12" style={{ textAlign: 'center', backgroundColor: '#bcbcbc', }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 'bold', }}>PT SURYA BUANA TESTARUAYA</span> <br />
                        <span style={{ fontSize: '0.6rem', }}>Kompl€k Gading Bukit lndah Blok J No,07 Jalan Bukit Gading Raya RT 018 RW 008 Kelapa Gading.lakarta Utara 142 rt 0</span>
                    </td>
                </tr>
            </tbody>
       </table>
    )
}

const index = () => {
    const { group_id, id } = useParams()
    const navigate = useNavigate()

    const { mutate: download, isLoading: loadingDownload, error: errorDownload } = useDownloadMealSheetMonthly({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `monthly_mealsheet_report.pdf`); 
            document.body.appendChild(link);
            link.click();
        }
    })
    const handleDownload = async (e) => {
        e.preventDefault()
        download(id)
    }
    
    return (
        <Grid container justifyContent='center'>
            <Grid item xs={12} md={10}>
                <Card sx={{ p: 2, mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Typography variant='h5'>
                                Print Preview Meal Sheet Monthly
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={2} justifyContent='space-between'>
                                <Button onClick={() => navigate(`/meal-sheet/report/${group_id}/monthly`)} startIcon={<Iconify icon='pajamas:go-back' />}>Back</Button>
                                <LoadingButton loading={loadingDownload} onClick={handleDownload} variant='contained'>Download</LoadingButton>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} alignSelf='center'>
                            <Stack direction='row' justifyContent='center'>
                                <Stack sx={{ maxWidth: '700px', overflowX: 'auto' }}>
                                    <PreviewMonthlyRecord />
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}

export default index