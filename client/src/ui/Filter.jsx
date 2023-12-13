import { useState } from 'react';
import ArrowButton from './ArrowButton';
import './filter.scss';

export default function Filter({ name, values, texts, selected, handleSelectionFunction }) {
    const [showOptions, setShowOptions] = useState(false);

    const isSelected = function(value) {
        return selected.includes(value);
    };

    const handleShowOptions = function() {
        setShowOptions(!showOptions);
    }

    return (
        <div className='filter'>
            <div className='filter__name-container' onClick={handleShowOptions}>
                <span
                    className='filter__name'
                >
                    {name}
                </span>
                <ArrowButton
                    isOpen={showOptions}
                />
            </div>
            <div className={`filter__buttons ${showOptions ? 'filter__buttons--visible' : ''}`} >
                {values.map((value, index) => (
                    <button key={value} onClick={() => handleSelectionFunction(value)} className={`filter__button ${isSelected(value) ? 'filter__button--selected' : ''}`}>
                        {texts[index]}
                    </button>
                ))}
            </div>
        </div>
    );
};
