import { useState } from 'react';
import Heading from './Heading';
import RatingPanelButton from './RatingPanelButton';
import Button from './Button';
import './ratingPanel.scss';

export default function RatingPanel() {
    const [rating, setRating] = useState(0);
    const [tempRating, setTempRating] = useState(0);

    const handleRating = function(rating) {
        setRating(rating);
    }

    return (
        <div className='rating-panel'>
            <div className='rating-panel__ratings-container'>
                <div className='rating-panel__user-rating-container'>
                    <Heading
                        type={'h2'}
                        size={'1rem'}
                        weight={500}
                    >
                        {rating || tempRating ? (
                            `Your rating: ${tempRating ? tempRating : rating}`
                        ) : (
                            'Rate movie'
                        )}
                    </Heading>
                </div>
                <div className='rating-panel__ratings'>
                    {Array.from({ length: 10 }, (_, i) => (
                        <RatingPanelButton
                            key={i}
                            size={'32px'}
                            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
                            onHandleRating={() => handleRating(i + 1)}
                            onHandleHoverIn={() => setTempRating(i + 1)}
                            onHandleHoverOut={() => setTempRating(0)}
                        />
                    ))}
                </div>
            </div>
            <div className='rating-panel__buttons-container'>
                <Button
                    width={'100%'}
                    fontSize={'0.875rem'}
                >
                    Add to watchlist
                </Button>
            </div>
        </div>
    )
}