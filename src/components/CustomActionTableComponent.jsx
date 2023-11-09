import { IconButton, Stack, Tooltip } from "@mui/material"
import Iconify from "./Iconify"

const CustomActionTableComponent = ({ approve = false, edit = false, refresh = false, download = false, handleApprove = () => {}, handleEdit = () => {}, handleDelete = () => {}, handleRefresh = () => {}, handleDownload = () => {} }) => {
    return (
        <Stack direction='row' justifyContent='center' height={38}>
            {approve ?
                <Tooltip title='Update Status'>
                    <IconButton hidden={approve} onClick={handleApprove}>
                        <Iconify icon='fluent:approvals-app-32-regular' sx={{ color: 'black', fontSize: 23 }} />
                    </IconButton>
                </Tooltip>
            : null
            }
            {edit ?
                <Tooltip title='Update'>
                    <IconButton onClick={handleEdit}>
                        <Iconify icon='material-symbols:edit' sx={{ color: 'green', fontSize: 23 }} />
                    </IconButton>
                </Tooltip>
            : null
            }
            {refresh ?
                <Tooltip title='Refresh'>
                    <IconButton onClick={handleRefresh}>
                        <Iconify icon='mdi:refresh' sx={{ color: 'blue', fontSize: 23 }} />
                    </IconButton>
                </Tooltip>
            : null
            }
            {download ?
                <Tooltip title='Download'>
                    <IconButton onClick={handleDownload}>
                        <Iconify icon='material-symbols:download' sx={{ color: 'black', fontSize: 23 }} />
                    </IconButton>
                </Tooltip>
            : null
            }
            <Tooltip title='Delete'>
                <IconButton onClick={handleDelete}>
                    <Iconify icon='material-symbols:delete' sx={{ color: 'red', fontSize: 23 }} />
                </IconButton>
            </Tooltip>
        </Stack>
    )
}
export default CustomActionTableComponent