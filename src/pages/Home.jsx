// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels } from "../store/slices/hotels";
import FilterWithStar from "../components/filterwithstar";
import Search from "../components/SearchBar";
import HotelList from "../components/hotellist";
 

const Home = () => {
  const dispatch = useDispatch();
  const { hotels, loading, error } = useSelector((state) => state.hotels);

  const [selectedStars, setSelectedStars] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  return (
    <>
     <div className="container">
      <FilterWithStar selectedStars={selectedStars} setSelectedStars={setSelectedStars} />
      <Search hotels={hotels} setFilteredHotels={setFilteredHotels} />

      <HotelList
        hotels={filteredHotels.length > 0 ? filteredHotels : hotels}
        loading={loading}
        error={error}
      />
    </div>
    </>
  );
};

export default Home;
