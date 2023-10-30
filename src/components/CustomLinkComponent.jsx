import { Link } from "react-router-dom"

const CustomLinkComponent = ({ label = 'defaul', url = '/dashboard', style = { textDecoration: 'none', color: 'blue' } }) => {
    return (
        <Link style={style} to={url}>
            {label}
        </Link>
    )
}
export default CustomLinkComponent