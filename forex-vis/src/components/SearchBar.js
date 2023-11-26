import React, { useState } from 'react';
import CountryNames from '../data/CountryNames.json';
import './SearchBar.css';

const SearchBar = (props) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);

    const handleSearch = () => {
        props.toggleCountrySelection(searchValue);
        setSearchValue('');
        updateSearchHistory(searchValue);
    };

    const updateSearchHistory = (value) => {
        // Avoid adding duplicates to the search history
        if (!searchHistory.includes(value)) {
            setSearchHistory([...searchHistory, value]);
        }
    };

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        const capitalizedInput = inputValue
            .split(' ')
            .map(capitalizeFirstLetter)
            .join(' ');
        setSearchValue(capitalizedInput);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return ( <
        div className = "searchWrapper" >
        <
        div className = "searchBar" >
        <
        input className = "searchBox"
        list = "countryList"
        placeholder = "Search Countries"
        value = { searchValue }
        onChange = { handleInputChange }
        onKeyDown = { handleKeyPress }
        /> <
        datalist id = "countryList" > {
            CountryNames.map((country) => ( <
                option key = { country.id }
                value = { country.text }
                />
            ))
        } <
        /datalist> < /
        div > <
        div className = "searchHistory" >
        <
        p > You have selected: < /p> <
        ul > {
            searchHistory.map((item, index) => ( <
                li key = { index }
                onClick = {
                    () => setSearchValue(item)
                } > { item } <
                /li>
            ))
        } <
        /ul> < /
        div > <
        /div>
    );
};

export default SearchBar;