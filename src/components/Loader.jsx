import React from 'react';
import './loader.css';

// if (loading) return <Loader type="hotels" />; will add the loader like that in different apps


const Loader = ({ type = 'general' }) => {
    const loadingMessages = {
      hotels: "Discovering perfect hotels for you...",
      rooms: "Finding available rooms that match your needs...",
      reviews: "Loading guest experiences and ratings...",
      bookings: "Retrieving your reservation details...",
      payment: "Processing your payment securely...",
      availability: "Checking real-time availability...",
      search: "Searching for your perfect stay...",
      photos: "Loading beautiful hotel photos...",
      offers: "Finding special offers and deals...",
      general: "Loading, please wait..."
    };
  
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-text">{loadingMessages[type]}</p>
      </div>
    );
  };
  
  export default Loader;
