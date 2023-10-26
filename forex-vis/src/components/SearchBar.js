import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = (props) => {
  const [searchValue, setSearchValue] = useState('');
  console.log(props);

  const handleSearch = () => {
    props.toggleCountrySelection(searchValue);
    console.log(searchValue);
    setSearchValue(''); // Clear the input box after searching
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
          placeholder="ENTER COUNTRY"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default SearchBar;
