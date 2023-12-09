import { PiSun } from "react-icons/pi";
import { IoIosMoon } from "react-icons/io";
import { useTheme } from "../context/ThemeContext";
import './themeSwitch.scss';

export default function ThemeSwitch({ size }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className='theme-switch' onClick={toggleTheme}>
            {theme === 'light' && (
                <PiSun size={size}/>
            )}
            {theme === 'dark' && (
                <IoIosMoon size={size}/>
            )}
        </div>
    )
}

ThemeSwitch.defaultProps = {
    size: '1.6875rem',
}