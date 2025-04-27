// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fetchHotelRoomsType, addRoom } from '../store/slices/rooms';
// import { editRoom } from '../store/slices/rooms';

// const AddRoom = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { HotelId } = useParams();
//   const { hotelRoomTypes, loadin, erro } = useSelector((state) => state.rooms);

//   const [roomData, setRoomData] = useState({
//     hotel: HotelId,
//     room_type: "",
//     price_per_night: "",
//     // available_rooms: "",
//     total_rooms: "",
//     amenities: ""
//   });

//   useEffect(() => {
//     dispatch(fetchHotelRoomsType(HotelId));
//   }, [dispatch, HotelId]);

//   const handleChange = (e) => {
//     setRoomData({ ...roomData, [e.target.name]: e.target.value });
//     console.log("changed", e.target.name, e.target.value);
//     console.log("Room Data:", roomData);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(addRoom(roomData));
//     navigate('/');
//   };

//   const selectedRoomTypeName = hotelRoomTypes.find(
//     (type) => type.id.toString() === roomData.room_type
//   )?.room_type;

//   return (
//     <div>
//       <h1>Add Room</h1>
//       <form onSubmit={handleSubmit}>
//         <label >price per night </label>
//         <input
//           type="number"
//           name="price_per_night"
//           placeholder="Price per Night"
//           value={roomData.price_per_night}
//           onChange={handleChange}
//         />
//         <label >Total Rooms</label>
//         <input
//           type="number"
//           name="total_rooms"
//           placeholder="Total Rooms"
//           value={roomData.total_rooms}
//           onChange={handleChange}
//         />
//         <label >Amenities</label>
//         <input
//           type="text"
//           name="amenities"
//           placeholder="Amenities"
//           value={roomData.amenities}
//           onChange={handleChange}
//         />
//         {/* <label >available_rooms</label>
//         <input
//         type="number"
//         name="available_rooms"
//         placeholder="Available Rooms"
//         value={roomData.available_rooms}
//         onChange={handleChange}
//         /> */}
//         <label htmlFor="roomType">Room Type:</label>
//         <select
//           name="room_type"
//           value={roomData.room_type}
//           onChange={handleChange}
//         >
//           <option value="">----</option>
//           {hotelRoomTypes.map((type) => (
//             <option key={type.id} value={type.id}>
//               {type.room_type}
//             </option>
//           ))}
//         </select>
//         {/* {roomData.room_type && (
//           <p>Selected Room Type: <strong>{selectedRoomTypeName}</strong></p>
//         )} */}

//         <button type="submit">Add Room</button>
//       </form>
//     </div>
//   );
// };

// export default AddRoom;



import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addRoom,
  editRoom,
  fetchRoomDetail,
  fetchHotelRoomsType,
} from '../store/slices/rooms';
import './AddRoom.css'; 

const AddRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {HotelId, roomId } = useParams(); // Get roomId from URL
  const isEdit = !!roomId;

  const {roomDetail,hotelRoomTypes ,loading } = useSelector((state) => state.rooms);
  console.log("roomDetail", roomDetail);
  const [roomData, setRoomData] = useState({
    hotel: HotelId,
    room_type: "",
    price_per_night: "",
    total_rooms: "",
    amenities: ""
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchRoomDetail(roomId));
    dispatch(fetchHotelRoomsType(HotelId));
    if (isEdit && roomDetail) {
      dispatch(fetchHotelRoomsType(roomDetail.hotel));
      setRoomData({
        hotel: roomDetail.hotel,
        room_type: roomDetail.room_type,
        price_per_night: roomDetail.price_per_night,
        total_rooms: roomDetail.total_rooms,
        amenities: roomDetail.amenities
      });
    }
  }, [dispatch, HotelId, isEdit]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(editRoom({ id: roomId, data: roomData }));
    } else {
      if (validateForm()) {
        dispatch(addRoom(roomData));
        navigate('/');
      }
    }
    navigate('/');
  };

  return (
    <div className="add-room-container">
      <div className="add-room-card">
        <h1 className="add-room-title">Add New Room</h1>
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
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
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

