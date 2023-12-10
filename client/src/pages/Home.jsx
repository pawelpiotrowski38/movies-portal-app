import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSessionStorageState } from '../hooks/useSessionStorageState';
import api from '../api/api';
import { genresValues, countriesValues, yearsValues, moviesSortValues, moviesSortTexts } from '../data/constants';
import MoviesList from '../features/movies/MoviesList';
import SelectInput from '../ui/SelectInput';
import Filters from '../ui/Filters';
import Button from '../ui/Button';
import Message from '../ui/Message';
import Spinner from '../ui/Spinner';
import './home.scss';

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [movies, setMovies] = useState([]);
    const [sortOption, setSortOption] = useSessionStorageState(
        searchParams.get('sort') || '', 'title_asc', 'movies_sort_option'
    );
    const genresParam = searchParams.get('genres');
    const initialGenresFilter = genresParam ? (
        genresParam.split(',').filter(genre => genresValues.includes(genre))
    ) : [];
    const countriesParam = searchParams.get('countries');
    const initialCountriesFilter = countriesParam ? (
        countriesParam.split(',').filter(country => countriesValues.includes(country))
    ) : [];
    const yearsParam = searchParams.get('years');
    const initialYearsFilter = yearsParam ? (
        yearsParam.split(',').filter(year => yearsValues.includes(year))
    ) : [];
    const [genresFilter, setGenresFilter] = useSessionStorageState(
        initialGenresFilter, [], 'movies_selected_genres'
    );
    const [countriesFilter, setCountriesFilter] = useSessionStorageState(
        initialCountriesFilter, [], 'movies_selected_countries'
    );
    const [yearsFilter, setYearsFilter] = useSessionStorageState(
        initialYearsFilter, [], 'movies_selected_years'
    );
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = {
                sortOption: sortOption,
                filters: {
                    genresFilter,
                    countriesFilter,
                    yearsFilter,
                },
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
    }, [sortOption, genresFilter, countriesFilter, yearsFilter]);

    useEffect(() => {
        const paramsToUpdate = {};

        paramsToUpdate.sort = sortOption;

        if (genresFilter.length > 0) {
            paramsToUpdate.genres = genresFilter.join(',');
        }
        if (countriesFilter.length > 0) {
            paramsToUpdate.countries = countriesFilter.join(',');
        }
        if (yearsFilter.length > 0) {
            paramsToUpdate.years = yearsFilter.join(',');
        }

        setSearchParams(paramsToUpdate);
    }, [sortOption, genresFilter, countriesFilter, yearsFilter, setSearchParams]);

    const handleSortOptionChange = function(e) {
        setSortOption(e.target.value);
    };

    const handleToggleFilters = function() {
        setShowFilters(!showFilters);
    };

    const handleGenreSelection = (genre) => {
        let updatedGenres;
        if (genresFilter.includes(genre)) {
            updatedGenres = genresFilter.filter((selectedGenre) => selectedGenre !== genre);
        } else {
            updatedGenres = [...genresFilter, genre];
        }
        setGenresFilter(updatedGenres);
    };

    const handleCountrySelection = (country) => {
        let updatedCountries;
        if (countriesFilter.includes(country)) {
            updatedCountries = countriesFilter.filter((selectedCountry) => selectedCountry !== country);
        } else {
            updatedCountries = [...countriesFilter, country];
        }
        setCountriesFilter(updatedCountries);
    };

    const handleYearSelection = (year) => {
        let updatedYears
        if (yearsFilter.includes(year)) {
            updatedYears = yearsFilter.filter((selectedYear) => selectedYear !== year);
        } else {
            updatedYears = [...yearsFilter, year];
        }
        setYearsFilter(updatedYears);
    };

    const handleResetFilters = () => {
        setGenresFilter([]);
        setCountriesFilter([]);
        setYearsFilter([]);
    };

    const filters = [
        {
            name: 'Genres',
            values: genresValues,
            selected: genresFilter,
            selectionHandler: handleGenreSelection,
        },
        {
            name: 'Countries',
            values: countriesValues,
            selected: countriesFilter,
            selectionHandler: handleCountrySelection,
        },
        {
            name: 'Years',
            values: yearsValues,
            selected: yearsFilter,
            selectionHandler: handleYearSelection,
        },
    ]

    return (
        <div className='home'>
            <div className='home__container'>
                <div className='home__sort'>
                    <SelectInput
                        width={'12rem'}
                        currentValue={sortOption}
                        valuesList={moviesSortValues}
                        textsList={moviesSortTexts}
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
                <div className={`home__filters ${showFilters ? 'home__filters--visible' : ''}`}>
                    <Filters
                        filters={filters}
                        onHandleResetFilters={handleResetFilters}
                        visible={showFilters}
                    />
                </div>
                {isLoading ? (
                    <Message>
                        <Spinner
                            primaryColor={'praimry-text-color'}
                            secondaryColor={'component-background-color'}
                        />
                    </Message>
                ) : (
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