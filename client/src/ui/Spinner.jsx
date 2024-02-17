import './spinner.scss';

export default function Spinner({ 
    primaryColor,
    duration,
    size,
    width,
}) {
    const styles = {
        borderTopColor: `transparent`,
        borderRightColor: `var(--${primaryColor})`,
        borderBottomColor: `var(--${primaryColor})`,
        borderLeftColor: `var(--${primaryColor})`,
        animationDuration: duration,
        width: size,
        height: size,
        borderWidth: width,
    }

    return (
        <div className='spinner'>
            <div className='spinner__spin' style={styles}></div>
        </div>
    )
}

Spinner.defaultProps = {
    primaryColor: 'primary-text-color',
    duration: '1s',
    size: '1.375rem',
    width: '0.1875rem',
};