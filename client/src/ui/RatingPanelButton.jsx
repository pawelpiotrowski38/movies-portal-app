import { IoStarOutline } from "react-icons/io5";
import { IoStar } from "react-icons/io5";
import './ratingPanelButton.scss';

export default function RatingPanelButton({
    full,
    size,
    onHandleRating,
    onHandleHoverIn,
    onHandleHoverOut
}) {
    return (
        <button
            className='rating-panel-button'
            onClick={onHandleRating}
            onMouseEnter={onHandleHoverIn}
            onMouseLeave={onHandleHoverOut}
        >
            {full ? (
                <IoStar size={size}/>
            ) : (
                <IoStarOutline size={size}/>
            )}
        </button>
    )
}