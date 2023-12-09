import { AiOutlineClose } from 'react-icons/ai';
import './closeButton.scss';

export default function CloseButton({ onCloseHandler }) {
    return (
        <button
            className='close-button'
            onClick={onCloseHandler}
        >
            <AiOutlineClose size={'34px'} className='close-button__icon'/>
        </button>
    )
}