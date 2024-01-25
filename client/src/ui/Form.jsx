import './form.scss';

export default function Form({ maxWidth, padding, onSubmit, children }) {
    const styles = {
        maxWidth: maxWidth,
        padding: padding,
    }

    return (
        <form className='form' style={styles} onSubmit={onSubmit}>
            {children}
        </form>
    )
}

Form.defaultProps = {
    maxWidth: '100%',
    padding: '1rem',
}
