import React, { useState } from 'react';
import './selectInput.scss';
import { useClickOutside } from '../hooks/useClickOutside';

export default function SelectInput({ width, currentValue, valuesList, textsList, onHandleSortOptionChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = valuesList.reduce((acc, val, index) => {
        acc[val] = textsList[index];
        return acc;
    }, {});

    const styles = {
        width: width
    };

    const selectPanelRef = useClickOutside(() => {
        setIsOpen(false);
    });

    const handleToggleSelect = () => {
        setIsOpen(!isOpen);
    };

    const handleButtonClick = (e) => {
        onHandleSortOptionChange(e);
        setIsOpen(false);
    }

    return (
        <div ref={selectPanelRef} className='select-input' style={styles}>
            <label className="select-input__label" onClick={handleToggleSelect}>
                <span>{sortOptions[currentValue]}</span>
                <div
                    className={isOpen ? 'select-input__arrow select-input__arrow--open' : 'select-input__arrow'}
                >
                </div>
            </label>
                <div className={`select-input__options ${isOpen ? 'select-input__options--visible' : ''}`}>
                    {valuesList.map((value, index) => (
                        <button key={index} onClick={handleButtonClick} value={value}>
                            {textsList[index]}
                        </button>
                    ))}
                </div>
        </div>
    )
}
