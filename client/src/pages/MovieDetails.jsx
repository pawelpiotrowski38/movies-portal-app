import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import MovieCardLarge from '../features/movies/MovieCardLarge';
import MovieAddInfo from '../features/movies/MovieAddInfo';
import Comments from '../features/comments/Comments';
import RatingPanel from '../ui/RatingPanel';
import Message from '../ui/Message';
import Spinner from '../ui/Spinner';
import './movieDetails.scss';

const comments = [
    {
        id: 1,
        author: 'user1',
        time: '2 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: 2,
        author: 'user2',
        time: '5 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: 3,
        author: 'user2',
        time: '5 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: 4,
        author: 'user2',
        time: '5 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: 5,
        author: 'user2',
        time: '5 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: 6,
        author: 'user2',
        time: '5 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: 7,
        author: 'user2',
        time: '5 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: 8,
        author: 'user2',
        time: '5 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: 9,
        author: 'user2',
        time: '5 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
]

export default function MovieDetails() {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { movieParams } = useParams();
    const movieId = movieParams.split('-')[0]; 

    useEffect(() => {
        const fetchData = async function() {
            try {
                const response = await api.get(`/movie/details/${movieId}`);
                setMovie(response.data.results);
            } catch (err) {
                console.log(err.response.data.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [movieId]);

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
                                        userRating={movie.rating}
                                        userWatchlist={movie.watchlist}
                                    />
                                </div>
                                <MovieAddInfo movie={movie} />
                            </div>
                            <Comments comments={comments} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}