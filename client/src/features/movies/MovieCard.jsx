import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClickOutside } from '../../hooks/useClickOutside';
import { capitalizeFirstLetter, convertToUrlFormat } from '../../utils/formatText';
import MovieCardPanel from './MovieCardPanel';
import EllipsisButton from '../../ui/EllipsisButton';
import CircleSeparator from '../../ui/CircleSeparator';
import Rating from '../../ui/Rating';
import './movieCard.scss';

export default function MovieCard({ movie }) {
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const movieTitle = convertToUrlFormat(movie.title);
    const movieGenres = capitalizeFirstLetter(movie.genres_names);

    const panelRef = useClickOutside(() => {
        setIsPanelVisible(false);
    });

    return (
        <li className='movie-card'>
            <div className='movie-card__image-container'>
                <Link to={`/movie/${movie.movie_id}-${movieTitle}`} >
                    <img
                        className='movie-card__image'
                        src={`/images/thumbnail.jpg`}
                        alt={`Poster of ${movie.title}`}
                    />
                </Link>
                <div
                    ref={panelRef}
                    className={`movie-card__panel ${isPanelVisible ? 'movie-card__panel--visible' : ''}`}
                >
                    <MovieCardPanel
                        onSetIsPanelVisible={setIsPanelVisible}
                    />
                </div>
            </div>
            <div className='movie-card__title-container'>
                <p className='movie-card__title'>{movie.title}</p>
                <div className='movie-card__genres-container'>
                    {movieGenres && (
                        (movieGenres.length === 1 ? (
                            <p className='movie-card__genre'>{movieGenres[0]}</p>
                        ) : (
                            (movieGenres.map((genre, index) => (
                                <div key={genre} className='movie-card__genre-container'>
                                    <p className='movie-card__genre'>{genre}</p>
                                    {index < movieGenres.length - 1 &&
                                        <CircleSeparator size={0.25} margin={0.25} />
                                    }
                                </div>
                            )))
                        ))
                    )}
                </div>
            </div>
            <div className='movie-card__button'>
                <EllipsisButton
                    onClickHandler={() => setIsPanelVisible(true)}
                />
            </div>
            <div className='movie-card__rating'>
                <Rating rating={movie.average_rating} />
            </div>
            
        </li>
    )
}