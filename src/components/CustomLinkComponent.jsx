import { Link } from "react-router-dom"

const CustomLinkComponent = ({ label = 'defaul', url = '/dashboard' }) => {
    return (
        <Link style={{ textDecoration: 'none', color: 'blue' }} to={url}>
            {label}
        </Link>
    )
}
export default CustomLinkComponent