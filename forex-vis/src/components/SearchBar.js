import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = (props) => {
  const [searchValue, setSearchValue] = useState('');
  console.log(props);
  const handleSearch = () => {
    props.toggleCountrySelection(searchValue)
    console.log(searchValue); 

  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
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