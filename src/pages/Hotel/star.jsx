import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels } from "../../store/slices/hotels";
import { useNavigate } from "react-router-dom";
import { addHotel, editHotel } from "../../store/slices/hotels";
import { useState } from "react";
import HotelFormModal from "../../components/HotelFormModal";
import { Star, Map, Phone, Calendar, Search } from 'lucide-react';

export default function SimpleHotelListingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, loading, error } = useSelector(state => state.hotels);
  const [editingHotel, setEditingHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleAddHotel = () => {
    setEditingHotel(null);
    setShowModal(true);
  };

  const handleSubmit = (formData) => {
    if (editingHotel) {
      dispatch(editHotel({ id: editingHotel.id, data: formData }))
        .unwrap()
        .then(() => {
          dispatch(fetchHotels());
        })
        .catch((error) => {
          console.error("Error updating hotel:", error);
        });
    } else {
      dispatch(addHotel(formData))
        .unwrap()
        .then(() => {
          dispatch(fetchHotels());
        })
        .catch((error) => {
          console.error("Error adding hotel:", error);
        });
    }
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          <p>Error: {error}</p>
          <button className="btn btn-primary mt-2" onClick={() => dispatch(fetchHotels())}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Page Cover Section with Carousel */}
      <div id="hotelCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {hotels
            .filter((hotel) => hotel.image.length > 0)
            .map((hotel, index) => {
              const imageUrl = hotel.image[0].image.startsWith("/media/")
                ? `http://127.0.0.1:8000${hotel.image[0].image}`
                : hotel.image[0].image;

              return (
                <div
                  key={hotel.id}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={imageUrl}
                    className="d-block w-100"
                    alt={hotel.name}
                    style={{ height: "400px", objectFit: "cover" }}
                  />

                  <div className="carousel-caption d-none d-md-block">
                    <h5>{hotel.name}</h5>
                    <p>{hotel.address || "No address provided"}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#hotelCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#hotelCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      { /* Breadcrumb Navigation */}  
      <nav aria-label="breadcrumb" className="bg-light py-2 px-3 rounded">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <a href="/home" className="text-decoration-none text-primary">Home</a>
          </li>
          <li className="breadcrumb-item active text-secondary" aria-current="page">
            Hotels
          </li>
        </ol>
      </nav>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold ">Our Hotels</h1>
          <button className="btn btn-primary" onClick={handleAddHotel}>
            + Add Hotel
          </button>
        </div>

        {hotels.length === 0 ? (
          <div className="text-center py-5">
            <h2 className="text-muted">No hotels found</h2>
          </div>
        ) : (
          <div className="row g-4">
            {hotels.map(hotel => {
              const imageUrl = hotel.image.length > 0
                ? (hotel.image[0].image.startsWith("/media/")
                  ? `http://127.0.0.1:8000${hotel.image[0].image}`
                  : hotel.image[0].image)
                :hotel.name; 

              return (
                <div key={hotel.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm cursor-pointer" onClick={() => navigate(`/star/detail/${hotel.id}`)}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={hotel.name}
                        className="card-img-top"
                        style={{ objectFit: 'cover', height: '200px' }}
                      />
                    ) : (
                      <div className="bg-secondary text-white d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        No Image
                      </div>

                    )}

                    <div className="position-absolute top-0 end-0 m-2 bg-white rounded px-2 py-1">
                      {Array(hotel.stars || 0).fill().map((_, i) => (
                        <Star key={i} size={16} fill="gold" color="gold" />
                      ))}
                    </div>

                    <div className="card-body">
                      <h5 className="card-title fw-bold">{hotel.name}</h5>
                      <p className="card-text text-muted">{hotel.address || 'No address provided'}</p>
                      <p className="fw-semibold text-primary mb-0">
                        From {hotel.price_range || 'N/A'} EGY / night
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <HotelFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          initialData={editingHotel}
        />
      </div>
    </div>
  );
}
