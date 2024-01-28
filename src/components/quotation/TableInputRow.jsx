import Iconify from "@components/Iconify"
import useValueConverter from "@hooks/useValueConverter"
import { Checkbox, Stack, TableCell, TableRow, Typography } from "@mui/material"
import { NumberFormat } from "@utils/Format"
import { useState } from "react"
import DialogInputRow from "./DialogInputRow"

const TableInputRow = ({ v, i, deleteItemTable, onChangeByIndex, errors = {}, isApproved, handleClick = () => {}, isItemSelected }) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(!open)
    const { valueMemo, markUpMemo, eachTax, newPrice, amount, vatAmmount } = useValueConverter(v) 
    return (
        <TableRow 
            key={i}
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-6}
            selected={isItemSelected}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    disabled={isApproved}
                    onClick={(event) => handleClick(event, i)}
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                        'aria-labelledby': i,
                    }}
                />
            </TableCell>
            <TableCell>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>
                {valueMemo.name}
                {
                    !!errors[`item_product.${i}.item_product_id`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>(duplicate)</Typography> : ''
                }
            </TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.size}</TableCell>
            <TableCell>{valueMemo.unit}</TableCell>
            <TableCell>
                {v?.quantity || 0}
            </TableCell>
            <TableCell>{NumberFormat(valueMemo.price, 'Rp')}</TableCell>
            <TableCell>
                {valueMemo.tax !== 'yes' ? 'No' : `${NumberFormat(eachTax, 'Rp')}(11%)`}
            </TableCell>
            <TableCell>{valueMemo.tax !== 'yes' ? 'No' : NumberFormat(newPrice, 'Rp')}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{NumberFormat(valueMemo.markupPrice, 'Rp')}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{parseFloat(valueMemo.markupPercentage).toFixed(2)}%</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{NumberFormat(markUpMemo.markupValue, 'Rp')}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{NumberFormat(amount, 'Rp')}</TableCell>
            <TableCell>
               {valueMemo.tnt}
            </TableCell>
            <TableCell sx={{ minWidth: 150 }}>
                { vatAmmount !== 0 ?
                    `${NumberFormat(vatAmmount, 'Rp')}(11%)` : 'No'}
            </TableCell>
            <TableCell sx={{ minWidth: 150 }}>{NumberFormat(amount + vatAmmount, 'Rp')}</TableCell>
            <TableCell>
                {
                    !!v.remark ? v.remark : !!errors[`item_product.${i}.remark`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>Remark required</Typography> : ''
                }
            </TableCell>
            <TableCell align='center'>
                {isApproved ?
                '-'
                : 
                <Stack direction='row' spacing={2}>
                    <Iconify onClick={handleClose} icon='material-symbols:edit' sx={{ color: 'green', fontSize: '1rem', cursor: 'pointer' }} />
                    {/* <Iconify onClick={(e) => deleteItemTable(e, i)} icon='material-symbols:delete' sx={{ color: 'red', fontSize: '1rem', cursor: 'pointer' }} /> */}
                </Stack>
                }
                <DialogInputRow 
                    handleClose={handleClose} 
                    open={open} 
                    v={v} 
                    onChangeByIndex={onChangeByIndex}
                    i={i}
                    priceProps={valueMemo.price}
                    markupProps={{ percentage: valueMemo.markupPercentage, price: valueMemo.markupPrice }}
                />
            </TableCell>
        </TableRow>
    )
}



export default TableInputRow