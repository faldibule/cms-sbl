import { Box } from '@mui/material'
import { Link } from 'react-router-dom'

const CustomLinkBreadcrumsComponent = ({ to, title }) => {
    return <Box sx={{ color: 'black', textDecoration: 'none', ':hover': { textDecoration: 'underline' } }} component={Link} to={to}>{title}</Box>
}

export default CustomLinkBreadcrumsComponent