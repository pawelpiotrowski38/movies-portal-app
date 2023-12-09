import { useSessionStorageState } from "../../hooks/useSessionStorageState";
import Filters from "../../ui/Filters";
import './moviesFilters.scss';

export default function MoviesFilters({ onHandleChangeFilters, onSetShowFilters, visible }) {
    const [genresFilter, setGenresFilter] = useSessionStorageState([], 'movies_selected_genres');
    const [countriesFilter, setCountriesFilter] = useSessionStorageState([], 'movies_selected_countries');
    const [yearsFilter, setYearsFilter] = useSessionStorageState([], 'movies_selected_years');

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

    const handleChangeFilters = () => {
        const filters = {
            genres: genresFilter,
            countries: countriesFilter,
            years: yearsFilter,
        };
        onHandleChangeFilters(filters);
        onSetShowFilters(false);
    }

    const handleResetFilters = () => {
        setGenresFilter([]);
        setCountriesFilter([]);
        setYearsFilter([]);
        const filters = {
            genres: [],
            countries: [],
            years: [],
        };
        onHandleChangeFilters(filters);
    }

    const filters = [
        {
            name: 'Genres',
            values: [
                'drama', 'comedy', 'thriller', 'action', 'romance', 'horror', 'adventure', 'crime',
                'sci-fi', 'fantasy', 'mystery', 'animation', 'biography', 'music', 'family', 'history',
                'war', 'musical', 'sport', 'documentary', 'film-noir', 'western'
            ],
            selected: genresFilter,
            selectionHandler: handleGenreSelection,
        },
        {
            name: 'Countries',
            values: [
                'usa', 'india', 'china', 'uk', 'france', 'japan', 'south-korea', 'canada', 'germany',
                'australia', 'spain', 'italy', 'russia', 'mexico', 'brazil', 'hong-kong', 'nigeria',
                'sweden', 'norway', 'netherlands', 'denmark', 'iran', 'taiwan', 'argentina', 'turkey',
                'indonesia', 'poland', 'thailand', 'south-africa', 'egypt', 'philippines', 'finland',
                'greece', 'austria', 'belgium', 'czech-republic', 'switzerland', 'ireland', 'israel',
                'hungary', 'portugal', 'romania', 'new-zealand'
            ],
            selected: countriesFilter,
            selectionHandler: handleCountrySelection,
        },
        {
            name: 'Years',
            values: [
                '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012',
                '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000',
                '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990'
            ],
            selected: yearsFilter,
            selectionHandler: handleYearSelection,
        },
    ]

    return (
        <div className={`movies-filters ${visible ? 'movies-filters--visible' : ''}`}>
            <Filters
                filters={filters}
                onHandleChangeFilters={handleChangeFilters}
                onHandleResetFilters={handleResetFilters}
                visible={visible}
            />
        </div>
    )
}