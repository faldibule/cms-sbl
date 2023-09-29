import { IconButton, Stack } from "@mui/material"
import Iconify from "./Iconify"

const CustomActionTableComponent = () => {
    return (
        <Stack direction='row'>
            <IconButton>
                <Iconify icon='material-symbols:edit' sx={{ color: 'green' }} />
            </IconButton>
            <IconButton>
                <Iconify icon='material-symbols:delete' sx={{ color: 'red' }} />
            </IconButton>
        </Stack>
    )
}
export default CustomActionTableComponent