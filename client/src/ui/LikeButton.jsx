import { AiFillLike } from "react-icons/ai";
import './likeButton.scss';

export default function LikeButton({ isFilled, clickHandler, size }) {
    const style = {
        fill: isFilled ? 'var(--button-background-color)' : 'var(--element-background-color)',
        strokeWidth: isFilled ? '0' : '64px',
    };

    return (
        <button
            className='like-button'
            onClick={clickHandler}
        >
            <AiFillLike style={style} size={`${size}px`}/>
        </button>
    )
}

LikeButton.defaultProps = {
    isFilled: false,
    clickHandler: null,
    size: 24,
}
