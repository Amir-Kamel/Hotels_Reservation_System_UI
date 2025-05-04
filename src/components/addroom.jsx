import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';

import {
  addRoom,
  editRoom,
  fetchRoomDetail,
  fetchHotelRoomsType,
} from '../store/slices/rooms';
import './AddRoom.css'; 
const AddRoom = (Hotel_id) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { HotelId, roomId } = useParams(); 
  const isEdit = !!roomId;

  const { roomDetail, hotelRoomTypes, loading } = useSelector((state) => state.rooms);

  const [roomData, setRoomData] = useState({
    hotel: HotelId,
    room_type: "",
    price_per_night: "",
    total_rooms: "",
    amenities: ""
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchHotelRoomsType(HotelId));

    if (isEdit) {
      dispatch(fetchRoomDetail(roomId));
    }
  }, [dispatch, HotelId, roomId, isEdit]);

  useEffect(() => {
    if (isEdit && roomDetail && roomDetail.id) {
      setRoomData({
        hotel: roomDetail.hotel,
        room_type: roomDetail.room_type.id.toString(),
        price_per_night: roomDetail.price_per_night,
        total_rooms: roomDetail.total_rooms,
        amenities: roomDetail.amenities
      });
    }
  }, [roomDetail, isEdit]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  const handleChange = (e) => {
    setRoomData({
      ...roomData,
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

    if (!roomData.room_type) errors.room_type = "Please select a room type";
    if (!roomData.price_per_night) errors.price_per_night = "Price is required";
    if (!roomData.total_rooms) errors.total_rooms = "Total rooms is required";
    if (!roomData.amenities) errors.amenities = "Amenities are required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        if (isEdit) {
          await dispatch(editRoom({ id: roomId, data: roomData })).unwrap();
        } else {
          await dispatch(addRoom(roomData)).unwrap();
        }
        navigate(`/hotels/${HotelId}`);
        window.location.reload();
      }
    } catch (error) {
      console.log('API Validation Error:', error);

      if (error && typeof error === 'object') {
        const serverErrors = {};
        for (const key in error) {
          serverErrors[key] = error[key][0];
        }
        setFormErrors(serverErrors);
      }
    }
  };

  const selectedRoomTypeName = hotelRoomTypes.find(
    (type) => type.id.toString() === roomData.room_type
  )?.room_type;

  return (
    <div className="add-room-container">
      <div className="add-room-card">
        <h1 className="add-room-title">{isEdit ? "Edit Room" : "Add New Room"}</h1>

        <div className="progress-bar">
          <div className="progress-step active">Details</div>
          <div className="progress-step">Preview</div>
          <div className="progress-step">Confirmation</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="room_type">Room Type</label>
            <div className="select-wrapper">
              <select
                id="room_type"
                name="room_type"
                value={roomData.room_type}
                onChange={handleChange}
                className={formErrors.room_type ? "error" : ""}
              >
                <option value="">Select Room Type</option>
                {hotelRoomTypes.map((type) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.room_type}
                  </option>
                ))}
              </select>
              {formErrors.room_type && <span className="error-message">{formErrors.room_type}</span>}
            </div>
          </div>

          {selectedRoomTypeName && (
            <div className="selected-type-badge">
              Selected: {selectedRoomTypeName}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price_per_night">Price Per Night ($)</label>
              <input
                type="number"
                id="price_per_night"
                name="price_per_night"
                value={roomData.price_per_night}
                onChange={handleChange}
                className={formErrors.price_per_night ? "error" : ""}
                placeholder="199"
              />
              {formErrors.price_per_night && <span className="error-message">{formErrors.price_per_night}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="total_rooms">Total Rooms</label>
              <input
                type="number"
                id="total_rooms"
                name="total_rooms"
                value={roomData.total_rooms}
                onChange={handleChange}
                className={formErrors.total_rooms ? "error" : ""}
                placeholder="10"
              />
              {formErrors.total_rooms && <span className="error-message">{formErrors.total_rooms}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amenities">Amenities</label>
            <textarea
              id="amenities"
              name="amenities"
              value={roomData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Mini Bar, Ocean View, etc."
              rows="3"
              className={formErrors.amenities ? "error" : ""}
            />
            {formErrors.amenities && <span className="error-message">{formErrors.amenities}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/hotels/${HotelId}`)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Update Room" : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
