import useValueConverter from "@hooks/useValueConverter"
import { TableCell, TableRow, Typography } from "@mui/material"
import { NumberFormat } from "@utils/Format"

const DeletedTableRow = ({ v, i }) => {
    const { valueMemo, tax, total, grand_total } = useValueConverter(v) 

    return (
        <TableRow sx={{ bgcolor: '#fcefef' }} key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.name}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.brand}</TableCell>
            <TableCell sx={{ minWidth: 150 }} align="left">{valueMemo.description}</TableCell>
            <TableCell sx={{ minWidth: 150 }}>{valueMemo.size}</TableCell>
            <TableCell>{valueMemo.unit}</TableCell>
            <TableCell>{NumberFormat(valueMemo.price, 'Rp')}</TableCell>
            <TableCell>
                {v.quantity || 0}
            </TableCell>
            <TableCell>
                {v.vat || 11}%
            </TableCell>
            <TableCell>{valueMemo.tax !== 'yes' ? 'No' : NumberFormat(tax, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(total, 'Rp')}</TableCell>
            <TableCell>{NumberFormat(grand_total, 'Rp')}</TableCell>
            <TableCell sx={{ minWidth: 100 }} align="left">
                {
                    !!v.remark ? v.remark : !!errors[`item_product.${i}.remark`] ? <Typography sx={{ color: 'red', fontSize: '0.6rem' }}>Remark required</Typography> : ''
                }
            </TableCell>
        </TableRow>
    )
}
export default DeletedTableRow