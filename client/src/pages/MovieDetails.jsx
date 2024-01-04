import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import MovieCardLarge from '../features/movies/MovieCardLarge';
import MovieAddInfo from '../features/movies/MovieAddInfo';
import Message from '../ui/Message';
import Spinner from '../ui/Spinner';
import './movieDetails.scss';

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
                            primaryColor={'praimry-text-color'}
                            secondaryColor={'component-background-color'}
                        />
                    </Message>
                ) : (
                    <>
                        <MovieCardLarge movie={movie} />
                        <MovieAddInfo movie={movie} />
                    </>
                )}
            </div>
        </div>
    )
}