import Heading from "../../ui/Heading";
import Rating from "../../ui/Rating";
import CircleSeparator from "../../ui/CircleSeparator";
import { capitalizeFirstLetter } from "../../utils/formatText";
import './movieCardLarge.scss';

export default function MovieCardLarge({ movie }) {
    const movieGenres = capitalizeFirstLetter(movie.genres_names);
    const countriesList = movie.countries_names.split(',');

    const imageFallback = function(event) {
        event.target.src = '/images/thumbnail.jpg';
    };

    return (
        <section className='movie-card-large'>                   
            <div className='movie-card-large__image-container'>
                <img
                    className='movie-card-large__image'
                    src={movie.poster_url}
                    onError={imageFallback}
                    alt={`${movie.title} poster`}
                />
            </div>           
            <div className='movie-card-large__details-container'>
                <div className='movie-card-large__main-info-container'>
                    <div className='movie-card-large__title-container'>
                        <div className='movie-card-large__title'>
                            <Heading
                                type={'h2'}
                                alignment={'left'}
                            >
                                {movie.title}
                            </Heading>
                        </div>
                        <div className='movie-card-large__info-container'>
                            {movieGenres.length === 1 ? (
                                <div className='movie-card-large__info-container'>
                                    <p className='movie-card-large__info--sm'>{movieGenres[0]}</p>
                                </div>
                            ) : (
                                (movieGenres.map((genre, index) => (
                                    <div key={genre} className='movie-card-large__info-container'>
                                        <p className='movie-card-large__info--sm'>{genre}</p>
                                        {index < movieGenres.length - 1 &&
                                            <CircleSeparator size={0.375} />
                                        }
                                    </div>
                                )))
                            )}
                        </div>
                        <div className='movie-card-large__info-container'>
                            <p className='movie-card-large__info--sm'>{movie.release_date.slice(0, 4)}</p>
                            <CircleSeparator size={0.375} />
                            <p className='movie-card-large__info--sm'>{`120 min`}</p>
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
                    <p className='movie-card-large__info--md'>Director: John Doe</p>
                    <div className='movie-card-large__info-container'>
                        <p className='movie-card-large__info--md'>
                            Countries of origin:
                        </p>
                        &nbsp;
                        {countriesList.length === 1 ? (
                            <p className='movie-card-large__info--md'>{countriesList[0]}</p>
                        ) : (
                            (countriesList.map((country, index) => (
                                <div key={country} className='movie-card-large__info-container'>
                                    <p key={country} className='movie-card-large__info--md'>{country}</p>
                                    {index < countriesList.length - 1 && (
                                        <CircleSeparator size={0.4375} />
                                    )}
                                </div>
                            )))
                        )}
                    </div>
                    <p className='movie-card-large__info--md'>Language: English</p>
                </div>
            </div>
        </section>
    )
}