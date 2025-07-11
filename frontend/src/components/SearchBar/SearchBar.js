import React from 'react';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="검색"
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;