import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClickOutside } from '../../hooks/useClickOutside';
import MovieCardPanel from './MovieCardPanel';
import EllipsisButton from '../../ui/EllipsisButton';
import Rating from '../../ui/Rating';
import './movieCard.scss';

export default function MovieCard({ movie }) {
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    let movieTitle = movie.title.toLowerCase().replace(/\s+/g, '-');

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
                <p className='movie-card__genres'>Drama, Action</p>
                {/* <div className='movie-card-small-genres-container'>
                    {genresList && (
                        (genresList.length === 1 ? (
                            <div className='movie-card-small-genre'>
                                <p>{translationsGenres.genres[genresList[0]][language]}</p>
                            </div>
                        ) : (
                            (genresList.map((genre, index) => (
                                <div key={index} className='movie-card-small-genre'>
                                    <p>{translationsGenres.genres[genre][language]}</p>
                                    {index < genresList.length - 1 &&
                                        <div className='movie-card-small-genre-separator'></div>
                                    }
                                </div>
                            )))
                        ))
                    )}
                </div> */}
            </div>
            <div className='movie-card__button'>
                <EllipsisButton
                    onClickHandler={() => setIsPanelVisible(true)}
                />
            </div>
            <div className='movie-card__rating'>
                <Rating rating={8.2} />
            </div>
            
        </li>
    )
}