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
    const [allMoviesCount, setAllMoviesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

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

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = {
                sortOption: sortOption,
                filters: {
                    genresFilter,
                    countriesFilter,
                    yearsFilter,
                },
                offset: 0,
                limit: 10,
            }
            try {
                setIsLoading(true);
                const response = await api.get('/', { params: queryParams });
                setMovies(response.data.results);
                setAllMoviesCount(response.data.count);
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

    const handleShowMore = async function() {
        const queryParams = {
            sortOption: sortOption,
            filters: {
                genresFilter,
                countriesFilter,
                yearsFilter,
            },
            offset: `${page*10}`,
            limit: 10,
        }
        try {
            setIsLoading(true);
            const response = await api.get('/', { params: queryParams });
            setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
            setPage((prevPage) => prevPage + 1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSortOptionChange = function(e) {
        setSortOption(e.target.value);
        resetPage();
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
        resetPage();
    };

    const handleCountrySelection = (country) => {
        let updatedCountries;
        if (countriesFilter.includes(country)) {
            updatedCountries = countriesFilter.filter((selectedCountry) => selectedCountry !== country);
        } else {
            updatedCountries = [...countriesFilter, country];
        }
        setCountriesFilter(updatedCountries);
        resetPage();
    };

    const handleYearSelection = (year) => {
        let updatedYears
        if (yearsFilter.includes(year)) {
            updatedYears = yearsFilter.filter((selectedYear) => selectedYear !== year);
        } else {
            updatedYears = [...yearsFilter, year];
        }
        setYearsFilter(updatedYears);
        resetPage();
    };

    const handleResetFilters = () => {
        setGenresFilter([]);
        setCountriesFilter([]);
        setYearsFilter([]);
        resetPage();
    };

    const resetPage = function() {
        setPage(1);
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
                    />
                </div>
                {movies.length > 0 ? (
                    <MoviesList movies={movies} />
                ) : (
                    (!isLoading && (
                        <Message>
                            There are no movies matching the applied filters
                        </Message>
                    ))
                )}
                <div className='home__message'>
                    {isLoading ? (
                        <Message>
                            <Spinner
                                primaryColor={'praimry-text-color'}
                                secondaryColor={'component-background-color'}
                            />
                        </Message>
                    ) : (
                        (movies.length < allMoviesCount && (
                            <Button
                                width={'100%'}
                                onClick={handleShowMore}
                            >
                                Show more
                            </Button>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
