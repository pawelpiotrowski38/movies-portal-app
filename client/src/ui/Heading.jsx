import './heading.scss';

export default function Heading({ type, size, weight, children }) {
    const styles = {
        fontSize: size,
        fontWeight: weight,
    }

    if (type === 'h2') {
        return (
            <h2 className='heading' style={styles}>
                {children}
            </h2>
        )
    }

    if (type === 'h3') {
        return (
            <h3 className='heading' style={styles}>
                {children}
            </h3>
        )
    }

    return (
        <h1 className='heading' style={styles}>
            {children}
        </h1>
    )
}

Heading.defaultProps = {
    type: 'h1',
    size: '1.5rem',
    weight: '600',
};