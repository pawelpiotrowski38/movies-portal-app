import './form.scss';

export default function Form({ onSubmit, children }) {
    return (
        <form className='form' onSubmit={onSubmit}>
            {children}
        </form>
    )
}