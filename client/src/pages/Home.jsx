import { useEffect, useState } from 'react';
import { useSessionStorageState } from '../hooks/useSessionStorageState';
import api from '../api/api';
import { getItemFromSessionStorage } from '../utils/getItemFromSessionStorage';
import MoviesFilters from '../features/movies/MoviesFilters';
import MoviesList from '../features/movies/MoviesList';
import SelectInput from '../ui/SelectInput';
import Button from '../ui/Button';
import Message from '../ui/Message';
import Spinner from '../ui/Spinner';
import './home.scss';

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [sortOption, setSortOption] = useSessionStorageState('title_asc', 'movies_sort_option');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        genres: getItemFromSessionStorage('movies_selected_genres'),
        countries: getItemFromSessionStorage('movies_selected_countries'),
        years: getItemFromSessionStorage('movies_selected_years'),
    })
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = {
                sortOption: sortOption,
                filters: filters,
            }
            try {
                setIsLoading(true);
                const response = await api.get('/', { params: queryParams });
                setMovies(response.data.results);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [sortOption, filters]);

    const handleSortOptionChange = function(e) {
        setSortOption(e.target.value);
    };

    const handleToggleFilters = function() {
        setShowFilters(!showFilters);
    }

    const handleChangeFilters = function(newFilters) {
        setFilters({
            ...filters,
            ...newFilters,
        })
    }

    return (
        <div className='home'>
            <div className='home__container'>
                <div className='home__filters'>
                    <SelectInput
                        width={'12rem'}
                        currentValue={sortOption}
                        valuesList={
                            ['title_asc', 'title_desc',
                            'rating_desc', 'rating_asc',
                            'year_desc', 'year_asc']
                        }
                        textsList={
                            ['Title (A-Z)', 'Title (Z-A)',
                            'Highest rating', 'Lowest rating',
                            'Newest', 'Oldest']
                        }
                        onHandleSortOptionChange={handleSortOptionChange}
                    />
                    <Button
                        width={'8rem'}
                        padding={'0.3125rem'}
                        fontSize={'0.9375rem'}
                        onClick={handleToggleFilters}
                    >
                        {showFilters ? (
                            'Hide filters'
                        ) : (
                            'Show filters'
                        )}
                    </Button>
                </div>
                <MoviesFilters
                    filters={filters}
                    onHandleChangeFilters={handleChangeFilters}
                    onSetShowFilters={setShowFilters}
                    visible={showFilters}
                />
                {isLoading ? (
                    <Message>
                        <Spinner
                            primaryColor={'praimry-text-color'}
                            secondaryColor={'component-background-color'}
                        />
                    </Message>
                ) : (
                    // movies.map((movie) => (
                    //     <p key={movie.movie_id}>
                    //         {movie.title}
                    //     </p>
                    // ))
                    (movies.length > 0 ? (
                        <MoviesList movies={movies} />
                    )
                    : (
                        <Message>
                            There are no movies...
                        </Message>
                    ))
                    
                )}
            </div>
        </div>
    )
}