import { movieKeywords } from '../../data/constants';
import Heading from '../../ui/Heading';
import './movieAddInfo.scss';

export default function MovieAddInfo({ movie }) {
    return (
        <section className='movie-add-info'>
            <div className='movie-add-info__heading-container'>
                <Heading
                    type={'h3'}
                    size={'1.25rem'}
                    alignment={'left'}
                >
                    Additional information
                </Heading>
            </div>
            <div className='movie-add-info__content-container'>
                <p className='movie-add-info__content'>
                    Release date: {movie.release_date.slice(0, 10)}
                </p>
                <p className='movie-add-info__content'>
                    Budget: $200 000
                </p>
                <p className='movie-add-info__content'>
                    Box office: $750 000
                </p>
                <div className='movie-add-info__keywords-container'>
                    <Heading
                        type={'h4'}
                        size={'0.9375rem'}
                        weight={500}
                        alignment={'left'}
                    >
                        Keywords
                    </Heading>
                    <div className='movie-add-info__keywords'>
                        {movieKeywords.map((keyword) => (
                            <div key={keyword} className='movie-add-info__keyword'>
                                {keyword}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}