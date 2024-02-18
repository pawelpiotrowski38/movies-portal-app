import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IoTrashBin } from "react-icons/io5";
import api from '../api/api';
import Heading from './Heading';
import RatingPanelButton from './RatingPanelButton';
import Button from './Button';
import './ratingPanel.scss';

export default function RatingPanel({ movieId, userRating, userWatchlist, isThumbnail }) {
    const { isLoggedIn } = useAuth();
    const [rating, setRating] = useState(0);
    const [tempRating, setTempRating] = useState(0);
    const [watchlist, setWatchlist] = useState(false);

    useEffect(() => {
        setRating(0);
        setWatchlist(false);
    }, [isLoggedIn]);

    useEffect(() => {
        setRating(userRating);
        setWatchlist(userWatchlist);
    }, [userRating, userWatchlist]);

    const handleRating = async function(newRating) {
        const requestMethod = rating > 0 ? 'patch' : 'post';
        console.log(requestMethod);

        try {
            if (requestMethod === 'post') {
                const response = await api.post(`/movies/ratings`, {
                    movieId: movieId,
                    rating: newRating,
                });

                console.log(response.data.message);
            }

            if (requestMethod === 'patch') {
                const response = await api.patch(`/movies/${movieId}/ratings`, {
                    rating: newRating,
                });

                console.log(response.data.message);
            }
            
            setRating(newRating);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleRatingDeletion = async function() {
        try {
            const response = await api.delete(`/movies/${movieId}/ratings`);
            setRating(0);
            
            console.log(response.data.message);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleWatchlist = async function(operationType) {
        try {
            if (operationType === 'add') {
                const response = await api.post(`/movies/watchlist`, {
                    movieId: movieId,
                    rating: rating,
                });

                console.log(response.data.message);
            } else if (operationType === 'delete') {
                const response = await api.delete(`/movies/${movieId}/watchlist`);

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
                    {rating > 0 && !tempRating && (
                        <button
                            className='rating-panel__delete-button'
                            onClick={handleRatingDeletion}
                        >
                            <IoTrashBin />
                        </button>
                    )}
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