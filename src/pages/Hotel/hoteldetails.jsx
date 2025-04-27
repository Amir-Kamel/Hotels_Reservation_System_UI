import React, { use, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Carousel } from 'react-bootstrap';
import { Star, Edit3, Trash, ImagePlus, MessagesSquare, Loader } from 'lucide-react';
import { fetchHotels, removeHotel } from '../../store/slices/hotels';
import { useState } from "react";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const hotel = useSelector(state =>
    state.hotels.hotels.find(hotel => hotel.id === parseInt(id))
  );

  useEffect(() => {
    if (!hotel) {
      dispatch(fetchHotels());
    }
  }, [dispatch, hotel]);

     
  const handleDelete = () => {
    console.log("Deleting hotel with ID:", hotel.id);
       
      dispatch(removeHotel(hotel.id))
        .unwrap()
        .then(() => {
          console.log("Hotel deleted successfully.");
          setShowDeleteModal(false); 
          navigate('/star');
        })
        .catch((error) => {
          console.error("Error deleting hotel:", error);
          alert("An error occurred while deleting the hotel. Please try again.");
        });
      
  };
  if (!hotel) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          < Loader />
        </div>
      </div>
    );
  }


  const firstImage =
    hotel.image && hotel.image.length > 0
      ? hotel.image[0].image.startsWith("/media/")
        ? `http://127.0.0.1:8000${hotel.image[0].image}`
        : hotel.image[0].image
      : hotel.name;

  return (
    <div>
      <div
        className="cover-section mb-4"
        style={{
          backgroundImage: `url(${firstImage || 'https://via.placeholder.com/1920x400'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        }}
      >
        <h1 className="fw-bold">{hotel.name}</h1>
      </div>

      <div className="container py-4">
        <h1 className="fw-bold mb-4">{hotel.name}</h1>

        {hotel.image && hotel.image.length > 0 ? (
          <Carousel className="mb-4">
            {hotel.image.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block w-100"
                  src={img.image.startsWith("/media/") ? `http://127.0.0.1:8000${img.image}` : img.image}
                  alt={`Slide ${idx}`}
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div className="text-muted mb-4">No images available</div>
        )}

        <div className="mb-4">
          <h5 className="text-secondary">Description</h5>
          <p>{hotel.description || "No description provided."}</p>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4">
          <span className="fw-bold text-primary">Price from: {hotel.price_range || 'N/A'} EGY /night</span>
          <span className="text-muted">Location: {hotel.address || 'Unknown'}</span>
          <span className="text-warning">
            {Array(hotel.stars || 0).fill().map((_, i) => (
              <Star key={i} size={20} fill="gold" color="gold" />
            ))}
          </span>
        </div>

        <div className="d-flex flex-wrap gap-3 mb-5">
          <button className="btn btn-warning" onClick={() => navigate(`/createimage/${hotel.id}`)}>
            <ImagePlus className="me-2" size={18} /> Add Image
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/hotels/${hotel.id}/reviews`)}>
            <MessagesSquare className="me-2" size={18} /> Show Reviews
          </button>
          <button className="btn btn-success" onClick={() => navigate(`/edit-hotel/${hotel.id}`)}>
            <Edit3 className="me-2" size={18} /> Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>

        </div>

        <button
          className="btn btn-outline-dark"
          onClick={() => navigate(`/hotels/${hotel.id}`)}
        >
          Show All Rooms
        </button>
      </div>
      <div className="modal fade show" tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }}>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title text-danger">Confirm Deletion</h5>
        <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
      </div>
      <div className="modal-body">
        <p>Are you sure you want to delete <strong>{hotel.name}</strong>?</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
  {/* Backdrop */}
  
</div>

    </div>
    
  );
}
