import './circleSeparator.scss';

export default function CircleSeparator({ size, margin, color }) {
    const styles = {
        width: `${size}rem`,
        height: `${size}rem`,
        margin: `0 ${margin}rem`,
        backgroundColor: `var(--${color})`,
    }
    
    return (
        <span
            className='circle-separator'
            style={styles}
        ></span>
    )
}

CircleSeparator.defaultProps = {
    size: 0.5,
    margin: 0.5,
    color: 'secondary-text-color',
}
