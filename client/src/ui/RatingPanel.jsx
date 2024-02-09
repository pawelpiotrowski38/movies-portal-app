import { useState } from 'react';
import api from '../api/api';
import Heading from './Heading';
import RatingPanelButton from './RatingPanelButton';
import Button from './Button';
import './ratingPanel.scss';

export default function RatingPanel({ movieId, userRating, userWatchlist, isThumbnail }) {
    const [rating, setRating] = useState(userRating);
    const [tempRating, setTempRating] = useState(0);
    const [watchlist, setWatchlist] = useState(userWatchlist);

    const handleRating = async function(rating) {
        try {
            const response = await api.post('/ratings/add', {
                movieId: movieId,
                rating: rating,
            });
            setRating(rating);
            
            console.log(response.data.message);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleWatchlist = async function(operationType) {
        try {
            if (operationType === 'add') {
                const response = await api.post(`/watchlist/add`, {
                    movieId: movieId,
                    rating: rating,
                });

                console.log(response.data.message);
            } else if (operationType === 'delete') {
                const response = await api.delete(`/watchlist/delete/${movieId}`);

                console.log(response.data.message);
            } else {
                return;
            }

            setWatchlist((watchlist => !watchlist));
        } catch (error) {
            console.log(error.response);
        }
    }

    return (
        <div className='rating-panel'>
            <div className='rating-panel__ratings-container'>
                <div className='rating-panel__user-rating-container'>
                    <Heading
                        type={'h2'}
                        size={isThumbnail ? '1rem' : '1.25rem'}
                        weight={isThumbnail ? 500 : 600}
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
                    fontSize={isThumbnail ? '0.875rem' : '0.9375rem'}
                    onClick={() => handleWatchlist(watchlist ? 'delete' : 'add')}
                >
                    {watchlist ? `Remove from watchlist` : `Add to watchlist`}
                </Button>
            </div>
        </div>
    )
}