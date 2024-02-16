import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import MovieCardLarge from '../features/movies/MovieCardLarge';
import MovieAddInfo from '../features/movies/MovieAddInfo';
import Comments from '../features/comments/Comments';
import RatingPanel from '../ui/RatingPanel';
import Message from '../ui/Message';
import Spinner from '../ui/Spinner';
import './movieDetails.scss';

export default function MovieDetails() {
    const { username } = useAuth();

    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { movieParams } = useParams();
    const movieId = movieParams.split('-')[0]; 

    useEffect(() => {
        const fetchData = async function() {
            const queryParams = {
                username: username,
            }

            try {
                const response = await api.get(`/movies/${movieId}`, { params: queryParams });
                setMovie(response.data.results);
            } catch (err) {
                console.log(err.response.data.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [movieId, username]);

    return (
        <div className='movie-details'>
            <div className='movie-details__container'>
                {isLoading ? (
                    <Message>
                        <Spinner 
                            primaryColor={'primary-text-color'}
                            secondaryColor={'component-background-color'}
                        />
                    </Message>
                ) : (
                    <>
                        <MovieCardLarge movie={movie} />
                        <div className='movie-details__add-container'>
                            <div className='movie-details__sticky-container'>
                                <div className='movie-details__rating-panel-container'>
                                    <RatingPanel
                                        movieId={movie.movie_id}
                                        userRating={movie.rating}
                                        userWatchlist={movie.watchlist}
                                    />
                                </div>
                                <MovieAddInfo movie={movie} />
                            </div>
                            <Comments movieId={movieId} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}