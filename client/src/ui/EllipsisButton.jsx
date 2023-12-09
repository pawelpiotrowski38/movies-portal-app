import './ellipsisButton.scss';

export default function EllipsisButton({ onClickHandler }) {
    return (
        <button className='ellipsis-button' onClick={onClickHandler}>
            <span className='ellipsis-button__span'></span>
            <span className='ellipsis-button__span'></span>
            <span className='ellipsis-button__span'></span>
        </button>
    )
}