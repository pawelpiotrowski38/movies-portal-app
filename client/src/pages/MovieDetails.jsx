import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import './movieDetails.scss';
import Message from '../ui/Message';
import Spinner from '../ui/Spinner';

export default function MovieDetails() {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { movieParams } = useParams();
    const movieId = movieParams.split('-')[0]; 

    useEffect(() => {
        const fetchData = async function() {
            try {
                setIsLoading(true);
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
                    <p>{movie.title}</p>
                )}
            </div>
        </div>
    )
}