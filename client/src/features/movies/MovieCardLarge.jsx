import Heading from "../../ui/Heading";
import Rating from "../../ui/Rating";
import { capitalizeFirstLetter } from "../../utils/formatText";
import './movieCardLarge.scss';

export default function MovieCardLarge({ movie }) {
    const movieGenres = capitalizeFirstLetter(movie.genres_names);
    const countriesList = movie.countries_names.split(',');

    return (
        <div className='movie-card-large'>                   
            <div className='movie-card-large__image-container'>
                <img className='movie-card-large__image' src={`/images/thumbnail.jpg`} alt={`${movie.title} poster`} />
            </div>           
            <div className='movie-card-large__details-container'>
                <div className='movie-card-large__main-info-container'>
                    <div className='movie-card-large__title'>
                        <Heading type={'h2'}>
                            {movie.title}
                        </Heading>
                        <div className='movie-card-large__info-container'>
                            {movieGenres.length === 1 ? (
                                <div className='movie-card-large__info-container'>
                                    <p className='movie-card-large__info'>{movieGenres[0]}</p>
                                </div>
                            ) : (
                                (movieGenres.map((genre, index) => (
                                    <div key={genre} className='movie-card-large__info-container'>
                                        <p className='movie-card-large__info'>{genre}</p>
                                        {index < movieGenres.length - 1 &&
                                            <span className='movie-card-large__separator'></span>
                                        }
                                    </div>
                                )))
                            )}
                        </div>
                        <div className='movie-card-large__info-container'>
                            <p className='movie-card-large__info'>{movie.release_date.slice(0, 4)}</p>
                            <span className='movie-card-large__separator'></span>
                            <p className='movie-card-large__info'>{`120 min`}</p>
                        </div>
                    </div>
                    <div className='movie-card-large__rating'>
                        <Rating
                            rating={movie.average_rating}
                            size={4}
                            thickness={0.375}
                            fontSize={'1.25rem'}
                        />
                    </div>
                </div>
                <div className='movie-card-large__description-container'>
                    <p className='movie-card-large__description'>{movie.description}</p>
                </div>
                <div className='movie-card-large__add-info-container'>
                    <p className='movie-card-large__info'>Director: John Doe</p>
                    <div className='movie-card-large__info'>
                        Countries of origin:
                        &nbsp;
                        {countriesList.length === 1 ? (
                            <p className='movie-card-large__info'>{countriesList[0]}</p>
                        ) : (
                            (countriesList.map((country, index) => (
                                <p key={country} className='movie-card-large__info'>
                                    {country}{index < countriesList.length - 1 ? ',' : ''}
                                </p>
                            )))
                        )}
                    </div>
                    <p className='movie-card-large__info'>Language: English</p>
                </div>
            </div>
        </div>
    )
}