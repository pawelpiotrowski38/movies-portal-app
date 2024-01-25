import './formItem.scss';

export default function FormItem({
    id,
    label,
    type,
    value,
    onChange,
    placeholder,
    rows,
    maxLength,
    error
}) {
    return (
        <div className='form-item'>
            <label htmlFor={id} className='form-item__label'>
                {label}
            </label>
            {rows > 1 ? (
                <textarea
                    className={`form-item__input ${error ? 'form-item__input--error' : ''}`}
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    maxLength={maxLength}
                />
            ) : (
                <input
                    className={`form-item__input ${error ? 'form-item__input--error' : ''}`}
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                />
            )}
            
            <div className='form-item__error'>
                {error}
            </div>
        </div>
    )
}

FormItem.defaultProps = {
    id: 'form-item-id',
    label: 'form-item-label',
    type: 'text',
    value: '',
    onChange: null,
    placeholder: '',
    rows: 1,
    maxLength: 50,
    error: '',
}
