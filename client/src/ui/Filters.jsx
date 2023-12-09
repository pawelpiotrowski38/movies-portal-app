import Filter from "./Filter";
import Button from "./Button";
import './filters.scss';

const Filters = ({ filters, onHandleChangeFilters, onHandleResetFilters }) => {
    return (
        <div className='filters'>
            {filters.map((filter) => (
                <div key={filter.name} className='filters__item'>
                    <Filter
                        name={filter.name}
                        values={filter.values}
                        texts={filter.values}
                        selected={filter.selected}
                        handleSelectionFunction={filter.selectionHandler}
                    />
                </div>
            ))}
            <div className='filters__buttons-container'>
                <Button
                    width={'100%'}
                    padding={'0.3125rem'}
                    onClick={onHandleResetFilters}
                >
                    Reset Filters
                </Button>
                <Button
                    width={'100%'}
                    padding={'0.3125rem'}
                    onClick={onHandleChangeFilters}
                >
                    Set filters
                </Button>
            </div>
        </div>
    );
}

export default Filters;