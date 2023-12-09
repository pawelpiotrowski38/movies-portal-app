import './message.scss';

export default function Message({ children }) {
    return (
        <div className='message'>
            {children}
        </div>
    )
}