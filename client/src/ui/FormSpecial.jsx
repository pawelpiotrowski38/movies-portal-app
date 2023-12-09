import './formSpecial.scss';

export default function FormSpecial({ alignment, margin, children }) {
    const styles = {
        textAlign: alignment,
        marginTop: margin,
    }

    return (
        <div className='form-special' style={styles}>
            {children}
        </div>
    )
}

FormSpecial.defaultProps = {
    alignment: 'center',
    margin: '1.5rem',
}
