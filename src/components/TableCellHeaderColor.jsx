import { TableCell } from '@mui/material'

const TableCellHeaderColor = ({ children,  bgcolor = '#d6e9ff', ...rest }) => {
  return (
    <TableCell {...rest} sx={{  bgcolor, }}>{children}</TableCell>
  )
}

export default TableCellHeaderColor