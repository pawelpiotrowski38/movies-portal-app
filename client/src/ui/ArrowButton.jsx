import { IoIosArrowDown } from "react-icons/io";
import './arrowButton.scss';

export default function ArrowButton({ isOpen, clickHandler, size }) {
    return (
        <button
            className={`arrow-button ${isOpen ? 'arrow-button--open' : ''}`}
            onClick={clickHandler}
        >
            <IoIosArrowDown size={`${size}px`}/>
        </button>
    )
}

ArrowButton.defaultProps = {
    isOpen: false,
    clickHandler: null,
    size: 20,
}
