import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import './logo.scss';

export default function Logo() {
    const { theme } = useTheme();

    return (
        <Link to={'/'} className='logo'>
            <picture>
                <source media='(min-width:36em)' srcSet={`/images/logo-desktop-${theme}-mode.png`} />
                <img src={`/images/logo-mobile-${theme}-mode.png`} alt='Movies World' />
            </picture>
        </Link>
    )
}