// src/components/HotelList.jsx
import React from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const HotelList = ({ hotels, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="col-12">
        <div className="alert alert-info" role="alert">
          No hotels available.
        </div>
      </div>
    );
  }

  return (
    <div className="row mt-4">
      {hotels.map((hotel) => (
        <div key={hotel.id} className="col-md-4 mb-4">
          <Link to={`/hotel/${hotel.id}`} className="text-decoration-none">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{hotel.name}</h5>
                <p className="card-text">Stars: {hotel.stars}</p>
                <p className="card-text">Location: {hotel.location}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default HotelList;
