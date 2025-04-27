import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addBooking } from '../../store/slices/booking';
import { getAllHotels } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faBed, faCalendarAlt, faMoneyBillWave, faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const AddBooking = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const prefilledRoom = location.state?.room;

  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(prefilledRoom ? prefilledRoom.hotel : '');
  const [room, setRoom] = useState(prefilledRoom ? prefilledRoom.id : '');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomPrice, setRoomPrice] = useState(prefilledRoom ? parseFloat(prefilledRoom.price_per_night) : 0);
  const [availableRooms, setAvailableRooms] = useState(prefilledRoom ? prefilledRoom.available_rooms : 0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const token = localStorage.getItem('access');
  const user = localStorage.getItem('user');

  useEffect(() => {
    if (!token || !user) {
      console.log('User not logged in, redirecting to login...');
      navigate('/login');
    }

    getAllHotels()
      .then((res) => setHotels(res.data))
      .catch(() => setError('Failed to load hotels.'));
  }, [user, navigate]);

  useEffect(() => {
    if (!prefilledRoom) {
      const selectedHotel = hotels.find((h) => h.id === Number(hotel));
      setRooms(selectedHotel?.rooms || []);
      setRoom('');
      setRoomPrice(0);
    }
  }, [hotel, hotels, prefilledRoom]);


  useEffect(() => {
    if (!prefilledRoom) {
      const selectedRoom = rooms.find((r) => r.id === Number(room));
      setRoomPrice(selectedRoom?.price_per_night || 0);
      setAvailableRooms(selectedRoom?.available_rooms || 0);
    }
  }, [room, rooms, prefilledRoom]);

  useEffect(() => {
    if (checkIn && checkOut && roomPrice) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = (end - start) / (1000 * 60 * 60 * 24);
      setTotalPrice(nights > 0 ? nights * roomPrice : 0);
    } else {
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, roomPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const roomId = prefilledRoom ? prefilledRoom.id : room;
    const hotelId = prefilledRoom ? prefilledRoom.hotel : hotel;
  
    if (!hotelId || !roomId || !checkIn || !checkOut) {
      setError('All fields are required.');
      return;
    }
  
    try {
      await dispatch(
        addBooking({
          hotel: hotelId,
          room: roomId,
          check_in: checkIn,
          check_out: checkOut,
        })
      ).unwrap();
  
      setModalMessage('🎉 Booking added successfully!');
      setIsModalOpen(true);
  
      if (!prefilledRoom) {
        setHotel('');
        setRoom('');
      }
  
      setCheckIn('');
      setCheckOut('');
      setTotalPrice(0);
      setRooms([]);
    } catch (err) {
      const messages = typeof err === 'object' ? Object.values(err).flat().join(' | ') : 'Invalid data.';
      setError(messages);
    }
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/my-bookings');
  };

  return (
    <div className="container py-5">
      <div className="mx-auto p-4 shadow" style={{
        backgroundColor: '#FDF6EC',
        maxWidth: '700px',
        borderRadius: '15px',
        fontFamily: 'Segoe UI, sans-serif',
        color: '#2C1E1E'
      }}>
        <div className="mb-4">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={() => navigate('/')}
          >
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Home
          </button>
        </div>

        <h2 className="text-center mb-4" style={{ color: '#CD9A5E', fontWeight: 'bold' }}>
          <FontAwesomeIcon icon={faHotel} className="me-2" />
          Book Your Stay
        </h2>

        {error && <div className="alert alert-warning text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Hotel */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FontAwesomeIcon icon={faHotel} className="me-2 text-warning" />
              Hotel
            </label>
            {prefilledRoom ? (
              <div className="form-control" readOnly>
                {hotels.find((h) => h.id === prefilledRoom.hotel)?.name || 'Hotel Info'}
              </div>
            ) : (
              <select className="form-select" value={hotel} onChange={(e) => setHotel(e.target.value)} required>
                <option value="">Select Hotel</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Room */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FontAwesomeIcon icon={faBed} className="me-2 text-warning" />
              Room
            </label>
            {prefilledRoom ? (
                <>
                  <div className="form-control" readOnly>
                    {prefilledRoom.room_type?.room_type || 'Room Type'} – ${prefilledRoom.price_per_night}/night
                  </div>
                  <input type="hidden" value={prefilledRoom.id} onChange={() => {}} name="room" />
                </>
              ) : (
              <select
                className="form-select"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
              >
                <option value="">Select Room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.room_type?.room_type} – ${r.price_per_night}/night
                  </option>
                ))}
              </select>
              )}

          </div>

          {/* Available Rooms */}
          {prefilledRoom && (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FontAwesomeIcon icon={faBed} className="me-2 text-warning" />
                Available Rooms
              </label>
              <input className="form-control" type="number" value={availableRooms} readOnly />
            </div>
          )}

          {/* Dates */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-semibold">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-warning" />
                Check-in
              </label>
              <input type="date" className="form-control" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-warning" />
                Check-out
              </label>
              <input type="date" className="form-control" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              <FontAwesomeIcon icon={faMoneyBillWave} className="me-2 text-warning" />
              Total Price
            </label>
            <input className="form-control" type="text" value={`$${totalPrice}`} readOnly />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: '#B45F3A',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.6rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <FontAwesomeIcon icon={faBed} className="me-2" />
              Book Now
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" style={{ maxWidth: '500px', marginTop: '15%' }}>
            <div className="modal-content" style={{ backgroundColor: '#FDF6EC', borderRadius: '10px' }}>
              <div className="modal-header" style={{ borderBottom: 'none' }}>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body text-center" style={{ color: '#2C1E1E' }}>
                <h4 style={{ color: '#CD9A5E' }}>Success!</h4>
                <p>{modalMessage}</p>
                <button className="btn btn-primary" style={{ backgroundColor: '#B45F3A', borderColor: '#B45F3A' }} onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBooking;
