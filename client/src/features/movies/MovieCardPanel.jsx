import { useState } from 'react';
import Button from '../../ui/Button';
import CloseButton from '../../ui/CloseButton';
import Heading from '../../ui/Heading';
import RatingPanel from '../../ui/RatingPanel';
import './movieCardPanel.scss';
import RatingPanelButton from '../../ui/RatingPanelButton';

export default function MovieCardPanel({ onSetIsPanelVisible }) {
    const [rating, setRating] = useState(0);
    const [tempRating, setTempRating] = useState(0);

    const handleRating = function(rating) {
        setRating(rating);
    }

    return (
        <div className='movie-card-panel'>
            <div className='movie-card-panel__close-button-container'>
                <CloseButton
                    onCloseHandler={() => onSetIsPanelVisible(false)}
                />
            </div>
            <div className='movie-card-panel__ratings-container'>
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
                <RatingPanel>
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
                </RatingPanel>
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