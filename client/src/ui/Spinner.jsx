import './spinner.scss';

export default function Spinner({ 
    primaryColor,
    secondaryColor,
    duration
}) {
    const styles = {
        borderTopColor: `var(--${secondaryColor})`,
        borderRightColor: `var(--${primaryColor})`,
        borderBottomColor: `var(--${primaryColor})`,
        borderLeftColor: `var(--${primaryColor})`,
        animationDuration: duration,
    }

    return (
        <div className='spinner'>
            <div className='spinner__spin' style={styles}></div>
        </div>
    )
}

Spinner.defaultProps = {
    primaryColor: 'primary-text-color',
    secondaryColor: 'secondary-text-color',
    duration: '1s',
};