// src/components/FilterWithStar.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { filterHotels, fetchHotels } from "../store/slices/hotels";

const FilterWithStar = ({ selectedStars, setSelectedStars }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedStars.length === 0) {
      dispatch(fetchHotels());
    } else {
      dispatch(filterHotels(selectedStars));
    }
  }, [selectedStars, dispatch]);

  const handleStarChange = (star) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter((s) => s !== star));
    } else {
      setSelectedStars([...selectedStars, star]);
    }
  };

  return (
    <div className="container p-3 text-center">
      <h5 className="fw-bold text-secondary">--- Filter By Star Rating ---</h5>
      <div className="d-flex justify-content-center mb-4">
        {[3, 4, 5, 6, 7].map((star) => (
          <div key={star} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id={`star-${star}`}
              value={star}
              checked={selectedStars.includes(star)}
              onChange={() => handleStarChange(star)}
            />
            <label className="form-check-label" htmlFor={`star-${star}`}>
              {star} Star
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterWithStar;
