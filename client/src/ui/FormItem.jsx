import './formItem.scss';

export default function FormItem({
    id,
    label,
    type,
    value,
    onChange,
    placeholder,
    maxLength,
    error
}) {
    return (
        <div className='form-item'>
            <label htmlFor={id} className='form-item__label'>
                {label}
            </label>
            <input
                className={`form-item__input ${error ? 'form-item__input--error' : ''}`}
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
            />
            <div className='form-item__error'>
                {error}
            </div>
        </div>
    )
}