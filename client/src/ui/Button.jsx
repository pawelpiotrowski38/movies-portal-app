import { Link } from 'react-router-dom';
import './button.scss';

export default function Button({ width, padding, fontSize, disabled, linkTo, onClick, children }) {
    const styles = {
        width: width,
        paddingTop: padding,
        paddingBottom: padding,
        fontSize: fontSize,
    }

    if (linkTo && onClick) {
        return (
            <Link 
                to={linkTo}
                className='button'
                style={styles}
                onClick={onClick}
            >
                {children}
            </Link>
        )
    }
    
    if (linkTo) {
        return (
            <Link 
                to={linkTo}
                className='button'
                style={styles}
            >
                {children}
            </Link>
        )
    }

    if (onClick) {
        return (
            <button
                className='button'
                style={styles}
                disabled={disabled}
                onClick={onClick}
            >
                {children}
            </button>
        )
    }
    
    return (
        <button
            className='button'
            style={styles}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

Button.defaultProps = {
    width: 'auto',
    padding: '0.375rem',
    fontSize: '1rem',
    disabled: false,
    linkTo: null,
    onClick: null,
};