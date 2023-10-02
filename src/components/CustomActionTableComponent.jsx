import { IconButton, Stack } from "@mui/material"
import Iconify from "./Iconify"

const CustomActionTableComponent = ({ edit = false, handleEdit = () => {}, handleDelete = () => {} }) => {
    return (
        <Stack direction='row'>
            {edit ?
                <IconButton onClick={handleEdit}>
                    <Iconify icon='material-symbols:edit' sx={{ color: 'green' }} />
                </IconButton>
            : null
            }
            <IconButton onClick={handleDelete}>
                <Iconify icon='material-symbols:delete' sx={{ color: 'red' }} />
            </IconButton>
        </Stack>
    )
}
export default CustomActionTableComponent