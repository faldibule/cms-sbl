import Iconify from '@components/Iconify'
import Loading from '@components/Loading'
import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import useFetchMealSheetDetailById from '@hooks/meal-sheet-detail/useFetchMealSheetDetailById'
import moment from 'moment'
import 'moment/locale/id';
import useDownloadMealSheetDetail from '@hooks/meal-sheet-detail/useDownloadMealSheetDetail'
import { LoadingButton } from '@mui/lab'

const CheckStatusComponent = ({ isChecked }) => {
    if(isChecked){
        return <Iconify icon='mdi:check-bold' sx={{ color: 'black', fontSize: '0.7rem' }} />
    }
    return ''
}

const PreviewDailyRecord = () => {
    const { id } = useParams()
    const { data: rows, isLoading: loadingData } = useFetchMealSheetDetailById(id)
    
    const valueMemo = useMemo(() => {
        if(!!!rows && !loadingData) return []
        let tempObject = {
            no: 1,
            total_breakfast: 0,
            total_lunch: 0,
            total_dinner: 0,
            total_super: 0,
            total_accomodation: 0,
            total_total: 0,
        }
        rows?.meal_sheet_record.forEach((v, i) => {
            const total = v.breakfast + v.lunch + v.dinner + v.super
            tempObject = {
                no: tempObject.no + 1,
                total_breakfast: tempObject.total_breakfast + v.breakfast,
                total_lunch: tempObject.total_lunch + v.lunch,
                total_dinner: tempObject.total_dinner + v.dinner,
                total_super: tempObject.total_super + v.super,
                total_accomodation: tempObject.total_accomodation + v.accomodation,
                total_total: tempObject.total_total + total,
            }
        })
        return tempObject
    })

    if(loadingData){
        return 'Loading ...'
    }

    return (
        <table className="tg" style={{ minWidth: '700px' }}>
            <thead>
                {/* Kop Surat */}
                <tr>
                    <th className="tg-c3ow" colSpan="10">
                        <h1>PT.Surya Buana Lestarijaya</h1>
                        <b>Catering and Accomodation Service</b>
                    </th>
                </tr>
            </thead>
            <tbody>
                {/* Header */}
                <tr>
                    <td className="tg-7btt" colSpan="10" style={{ borderBottom: 'none' }}>Meal Count Sheet and Accomodation Record</td>
                </tr>
                <tr>
                    <td colSpan="3" style={{ borderRight: 'none', fontWeight: 'bold', borderTop: 'none' }}>{rows.meal_sheet_daily?.meal_sheet_group?.location?.location}</td>
                    <td className="tg-de2y" style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none', }}>{rows.client.client_name}</td>
                    <td className="tg-dvpl" colSpan="6" style={{ borderLeft: 'none', borderTop: 'none', }}>DATE : {moment(rows.meal_sheet_daily.meal_sheet_date).format('LL')}</td>
                </tr>

                {/* Content */}
                <tr>
                    <td className="tg-7btt" style={{ width: '10px' }}>NO</td>
                    <td className="tg-7btt">NAME</td>
                    <td className="tg-7btt">POSITION</td>
                    <td className="tg-7btt">COMPANY</td>
                    <td className="tg-7btt">B</td>
                    <td className="tg-7btt">L</td>
                    <td className="tg-7btt">D</td>
                    <td className="tg-7btt">S</td>
                    <td className="tg-7btt">TOTAL</td>
                    <td className="tg-7btt">ACCOM</td>
                </tr>
                {rows?.meal_sheet_record.map((v, i) => {
                    const total = v.breakfast + v.lunch + v.dinner + v.super
                    return (
                        <tr key={i}>
                            <td className="tg-7btt" style={{ width: '5px' }}>{i + 1}</td>
                            <td className="text-center">{v.name}</td>
                            <td className="text-center">{v.position}</td>
                            <td className="text-center">{v.company}</td>
                            <td className="tg-0pky">
                                <CheckStatusComponent isChecked={v.breakfast} />
                            </td>
                            <td className="tg-0pky">
                                <CheckStatusComponent isChecked={v.lunch} />
                            </td>
                            <td className="tg-0pky">
                                <CheckStatusComponent isChecked={v.dinner} />
                            </td>
                            <td className="tg-0pky">
                                <CheckStatusComponent isChecked={v.super} />
                            </td>
                            <td className="tg-0pky">{total}</td>
                            <td className="tg-0pky">
                                <CheckStatusComponent isChecked={v.accomodation} />
                            </td>
                            {/* <td className="tg-0pky">{v.breakfast}</td> */}
                            {/* <td className="tg-0pky">{v.lunch}</td> */}
                            {/* <td className="tg-0pky">{v.dinner}</td> */}
                            {/* <td className="tg-0pky">{v.super}</td> */}
                            {/* <td className="tg-0pky">{v.accomodation}</td> */}
                        </tr>
                    )
                })}
                <tr>
                    <td className="tg-7btt" style={{ width: '5px' }}></td>
                    <td className="tg-7btt">Total</td>
                    <td className="tg-7btt"></td>
                    <td className="tg-7btt"></td>
                    <td className="tg-7btt">{valueMemo.total_breakfast}</td>
                    <td className="tg-7btt">{valueMemo.total_lunch}</td>
                    <td className="tg-7btt">{valueMemo.total_dinner}</td>
                    <td className="tg-7btt">{valueMemo.total_super}</td>
                    <td className="tg-7btt">{valueMemo.total_total}</td>
                    <td className="tg-7btt">{valueMemo.total_accomodation}</td>
                </tr>

                {/* Signature */}
                <tr>
                    <td style={{ borderRight: 'none', borderBottom: 'none', }}></td>
                    <td style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none', textAlign: 'right', fontWeight: 'bold', fontSize: '0.5rem' }}>
                        <div>Mandays : {rows.mandays}</div>
                        <div>Casual B Fast : {rows.casual_breakfast}</div>
                        <div>Casual Lunch : {rows.casual_lunch}</div>
                        <div>Casual Diner : {rows.casual_dinner}</div>
                    </td>
                    <td style={{ borderLeft: 'none', borderBottom: 'none', }} colSpan="8"></td>
                </tr>
                <tr>
                    <td colSpan="2" style={{ borderTop: 'none', borderRight: 'none', }}>
                        <div style={{ minHeight: '100px', textAlign: 'center', marginTop: '0px', }}>
                            <p>Prepared By,</p>
                            <p style={{ marginTop: '60px', }}>{rows.prepared_by['name']}</p>
                            <p style={{ marginTop: '-5px', marginBottom: '0px', }}>{rows.prepared_by['position']}</p>
                        </div>
                    </td>
                    <td colSpan="2" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                        <div style={{ minHeight: '100px', textAlign: 'center', marginTop: '0px', }}>
                            <p>Checked By,</p>
                            <p style={{ marginTop: '60px', }}>{rows.checked_by['name']}</p>
                            <p style={{ marginTop: '-5px', marginBottom: '0px', }}>{rows.checked_by['position']}</p>
                        </div>
                    </td>
                    <td colSpan="4" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                        <div style={{ marginLeft: '-10px', minHeight: '100px', textAlign: 'center', marginTop: '0px', }}>
                            <p>Approved By,</p>
                            <p style={{ marginTop: '60px', }}>{rows.approved_by['name']}</p>
                            <p style={{ marginTop: '-5px', marginBottom: '0px', }}>{rows.approved_by['position']}</p>
                        </div>
                    </td>
                    <td colSpan="2" style={{ borderTop: 'none', borderLeft: 'none', }}>
                        <div style={{ minHeight: '100px', textAlign: 'center', marginTop: '0px', }}>
                            <p>Acknowledge By,</p>
                            <p style={{ marginTop: '60px', }}>Name</p>
                            <p style={{ marginTop: '-5px', marginBottom: '0px', }}>Position</p>
                        </div>
                    </td>
                </tr>

                {/* Footer */}
                <tr style={{ lineHeight: '12px', padding: 0,}}>
                    <td colSpan="10" style={{ textAlign: 'center', backgroundColor: '#bcbcbc' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 'bold', }}>PT SURYA BUANA TESTARUAYA</span> <br />
                        <span style={{ fontSize: '0.6rem' }}>Kompl€k Gading Bukit lndah Blok J No,07 Jalan Bukit Gading Raya RT 018 RW 008 Kelapa Gading.lakarta Utara 142 rt 0</span>
                    </td>
                </tr>
            </tbody>
       </table>
    )
}

const index = () => {
    const { group_id, daily_id, id } = useParams()
    const navigate = useNavigate()

    const { mutate: download, isLoading: loadingDownload, error: errorDownload } = useDownloadMealSheetDetail({
        onSuccess: (res) => {
            const temp = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = temp;
            link.setAttribute("download", `daily_mealsheet_report.pdf`); 
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
                                Print Preview Meal Sheet Daily
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack direction='row' spacing={2} justifyContent='space-between'>
                                <Button onClick={() => navigate(`/meal-sheet/detail/${group_id}/${daily_id}`)} startIcon={<Iconify icon='pajamas:go-back' />}>Back</Button>
                                <LoadingButton loading={loadingDownload} onClick={handleDownload} variant='contained'>Download</LoadingButton>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} alignSelf='center'>
                            <Stack direction='row' justifyContent='center'>
                                <Stack sx={{ maxWidth: '700px', overflowX: 'auto' }}>
                                    <PreviewDailyRecord />
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