// SearchBar.js
import React, { useState } from 'react';
import CountryNames from '../data/CountryNames.json';
import './SearchBar.css';

const SearchBar = (props) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const handleSearch = () => {
    props.toggleCountrySelection(searchValue);

    // Add the current search term to the search history
    const updatedSearchHistory = [...searchHistory, searchValue];
    setSearchHistory(updatedSearchHistory);

    // Add the selected country to the list of selected countries
    const updatedSelectedCountries = [...selectedCountries, searchValue];
    setSelectedCountries(updatedSelectedCountries);

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

  const clearSearchHistory = () => {
    setSearchHistory([]);
    setSelectedCountries([]); // Clear the selected countries
    props.clearMapSelectedCountries(); // Callback to clear selected countries on map
  };

  const renderSearchHistory = () => {
    if (searchHistory.length) {
      return (
        <div className="searchHistory">
          <span className="searchHistoryLabel">Search History:</span>
          <ul className="searchHistoryList">
            {searchHistory.map((item) => (
              <li key={item} className="searchHistoryItem">
                {item}
              </li>
            ))}
          </ul>
          <button className="clearHistoryButton" onClick={clearSearchHistory}>
            Clear History
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="searchWrapper">
      {renderSearchHistory()}
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
