import { TableCell } from '@mui/material'
import React from 'react'

const TableCellHeaderColor = ({ children, ...rest }) => {
  return (
    <TableCell {...rest} sx={{  bgcolor: '#d6e9ff' }}>{children}</TableCell>
  )
}

export default TableCellHeaderColor