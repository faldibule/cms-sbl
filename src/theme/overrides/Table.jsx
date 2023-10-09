// ----------------------------------------------------------------------

export default function (theme) {
    return {
        MuiTable: {
            defaultProps: {
                size: 'small'
            },
        },
        MuiTableCell: {
            defaultProps: {
                align: 'center'
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f7f7f7',
                  },
            }
        }
    };
  }
  