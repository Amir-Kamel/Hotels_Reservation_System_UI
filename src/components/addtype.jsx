import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createtype, fetchHotelRoomsType } from "../store/slices/rooms";
import './AddType.css';

const AddType = () => {
  const { hotel_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, hotelRoomTypes } = useSelector((state) => state.rooms);
  
  const [roomType, setRoomType] = useState({
    hotel: hotel_id,
    room_type: "",
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchHotelRoomsType(hotel_id));
  }, [dispatch, hotel_id]);

  const handleChange = (e) => {
    setRoomType({ 
      ...roomType, 
      [e.target.name]: e.target.value 
    });
    
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!roomType.room_type.trim()) {
      errors.room_type = "Room type is required";
    } else {
      const typeExists = hotelRoomTypes.some(
        type => type.room_type.toLowerCase() === roomType.room_type.toLowerCase()
      );
      
      if (typeExists) {
        errors.room_type = "This room type already exists";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   if (validateForm()) {
  //     setIsSubmitting(true);
  //     dispatch(createtype(roomType))
  //       .then(() => {
  //         navigate(`/hotels/details/${hotel_id}`);
  //       })
  //       .catch(() => {
  //         setIsSubmitting(false);
  //       });
  //   }
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      setIsSubmitting(true);
      dispatch(createtype(roomType))
        .unwrap()
        .then(() => {
          navigate(`/hotels/detail/${hotel_id}`);
        })
        .catch((err) => {
          console.error("Failed to create room type:", err);
          setIsSubmitting(false);
        });
    }
  };
  

  return (
    <div className="add-type-container">
      <div className="add-type-card">
        <h1 className="add-type-title">Add New Room Type</h1>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="room_type">
              Room Type <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="room_type"
              name="room_type"
              placeholder="e.g. Deluxe Suite, Standard Room"
              value={roomType.room_type}
              onChange={handleChange}
              className={formErrors.room_type ? "error" : ""}
            />
            {formErrors.room_type && (
              <span className="error-message">{formErrors.room_type}</span>
            )}
          </div>
          
          <div className="room-type-tips">
            <h4>Tips for Room Types:</h4>
            <ul>
              <li>Use descriptive names (e.g., "Ocean View Suite" rather than "Type A")</li>
              <li>Keep naming consistent with your existing room types</li>
              <li>Consider including key features in the name</li>
            </ul>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/hotels')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Room Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddType;