import Filter from "./Filter";
import Button from "./Button";
import './filters.scss';

export default function Filters({ filters, onHandleResetFilters }) {
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
            </div>
        </div>
    );
}
