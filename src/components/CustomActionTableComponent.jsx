import { IconButton, Stack, Tooltip } from "@mui/material"
import Iconify from "./Iconify"

const CustomActionTableComponent = ({ approve = false, edit = false, handleApprove = () => {}, handleEdit = () => {}, handleDelete = () => {} }) => {
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
            <Tooltip title='Delete'>
                <IconButton onClick={handleDelete}>
                    <Iconify icon='material-symbols:delete' sx={{ color: 'red', fontSize: 23 }} />
                </IconButton>
            </Tooltip>
        </Stack>
    )
}
export default CustomActionTableComponent