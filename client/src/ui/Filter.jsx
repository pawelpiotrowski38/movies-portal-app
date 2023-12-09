import { useState } from 'react';
import './filter.scss';

const Filter = ({ name, values, texts, selected, numberToDisplay, handleSelectionFunction }) => {
    const [showAllOptions, setShowAllOptions] = useState(false);

    const popularOptions = values.slice(0, numberToDisplay);
    const popularOptionsTexts = texts.slice(0, numberToDisplay);
    const otherOptions = values;//.slice().sort();
    const otherOptionsTexts = texts;//.slice().sort();

    const isSelected = (value) => {
        return selected.includes(value);
    };

    const handleShowMoreOptions = () => {
        setShowAllOptions(!showAllOptions);
    }

    return (
        <div className='filter'>
            <span className='filter__name'>
                {name}
            </span>
            <div className='filter__buttons'>
                {showAllOptions ? (
                    otherOptions.map((value, index) => (
                        <div key={index} className='filter__button-container'>
                            <button onClick={() => handleSelectionFunction(value)} className={`filter__button ${isSelected(value) ? 'filter__button--selected' : ''}`}>
                                {otherOptionsTexts[index]}
                            </button>
                        </div>
                    ))
                ) : (
                    popularOptions.map((value, index) => (
                        // <div key={index} className='filter__button-container'>
                            <button key={index} onClick={() => handleSelectionFunction(value)} className={`filter__button ${isSelected(value) ? 'filter__button--selected' : ''}`}>
                                {popularOptionsTexts[index]}
                            </button>
                        // </div>
                    ))
                    
                )}
                {values.length > numberToDisplay && (
                    <div className='filter__button-container'>
                        <button className='filter__button filter__button-show-more' onClick={handleShowMoreOptions}>
                            {showAllOptions ? 'Show less' : 'Show more'}
                        </button>
                    </div>
                )}
                <div className='filter__invisible-item'></div>
            </div>
        </div>
    );
};

export default Filter;