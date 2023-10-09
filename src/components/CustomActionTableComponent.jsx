import { IconButton, Stack } from "@mui/material"
import Iconify from "./Iconify"

const CustomActionTableComponent = ({ edit = false, handleEdit = () => {}, handleDelete = () => {} }) => {
    return (
        <Stack direction='row' justifyContent='center' height={38}>
            {edit ?
                <IconButton onClick={handleEdit}>
                    <Iconify icon='material-symbols:edit' sx={{ color: 'green', fontSize: 23 }} />
                </IconButton>
            : null
            }
            <IconButton onClick={handleDelete}>
                <Iconify icon='material-symbols:delete' sx={{ color: 'red', fontSize: 23 }} />
            </IconButton>
        </Stack>
    )
}
export default CustomActionTableComponent