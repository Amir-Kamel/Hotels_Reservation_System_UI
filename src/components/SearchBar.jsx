// src/components/Search.jsx
import React, { useState } from "react";
import "./searchBar.css"; // Assuming you have a CSS file for styling

const Search = ({ hotels, setFilteredHotels }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim() === "") {
      setSearchError("Please enter a hotel name to search.");
      setFilteredHotels([]);
      return;
    } else {
      setSearchError("");
    }

    const filtered = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(filtered);
  };

  return (
    <div className="search-container">
      <h5 className="search-heading">Find Your Perfect Stay</h5>
      <form className="search-form" onSubmit={handleSearch}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Enter Hotel Name" 
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button 
          type="submit" 
          className="search-button">
          Search
        </button>
      </form>
      {searchError && (
        <div className="alert alert-warning mt-2" role="alert">
          {searchError}
        </div>
      )}
    </div>
  );
};

export default Search;
