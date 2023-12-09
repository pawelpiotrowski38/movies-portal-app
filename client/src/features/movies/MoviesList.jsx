import MovieCard from './MovieCard';
import './moviesList.scss';

export default function MoviesList({ movies }) {
    return (
        <ul className='movies-list'>
            {movies.map((movie) => (
                <MovieCard key={movie.movie_id} movie={movie} />
            ))}
        </ul>
    )
}