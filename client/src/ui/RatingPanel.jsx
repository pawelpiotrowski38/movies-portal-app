import './ratingPanel.scss';

export default function RatingPanel({ children }) {
    return (
        <div className='rating-panel'>
            <div className='rating-panel__ratings-container'>
                {children}
            </div>
        </div>
    )
}