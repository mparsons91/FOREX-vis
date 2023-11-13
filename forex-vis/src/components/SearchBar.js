import React, { useState } from 'react';
import CountryNames from '../data/CountryNames.json';
import './SearchBar.css';

const SearchBar = (props) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    props.toggleCountrySelection(searchValue);
    setSearchValue('');
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

  return (
    <div className="searchWrapper">
      <div className="searchBar">
        <input
          className="searchBox"
          list="countryList"
          placeholder="Search Countries"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <datalist id="countryList">
          {CountryNames.map((country) => (
            <option key={country.id} value={country.text} />
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default SearchBar;
