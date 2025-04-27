import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, deleteBooking } from '../../store/slices/booking';
import { useNavigate } from 'react-router-dom';
import { getAllHotels } from '../../services/api';
import { FaBed, FaCalendarCheck, FaCalendarTimes, FaEdit, FaTimesCircle, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';

const BookingsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings } = useSelector((state) => state.bookings);
  const token = localStorage.getItem('access');
  const user = localStorage.getItem('user');
  const [hotels, setHotels] = useState([]);
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 👈 Filter state

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    } else {
      dispatch(fetchAllBookings());
      getAllHotels()
        .then((res) => {
          setHotels(res.data);
        })
        .catch(() => console.error('Failed to load hotels.'));
    }
  }, [dispatch, user, navigate]);

  const getBookingTitle = (hotelId, roomId) => {
    const hotel = hotels.find(h => h.id === Number(hotelId));
    if (!hotel) return `Hotel ${hotelId} – Room ${roomId}`;
    const room = hotel.rooms?.find(r => r.id === Number(roomId));
    if (!room) return `${hotel.name} – Room ${roomId}`;
    return `${hotel.name} – ${room.room_type?.room_type}`;
  };

  const handleDelete = () => {
    if (deleteBookingId) {
      dispatch(deleteBooking(deleteBookingId))
        .then(() => navigate('/my-bookings'))
        .catch((err) => console.error('Delete Booking Error:', err));
    }
    setShowModal(false);
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'confirmed': return '#CD9A5E';
      case 'pending': return '#8A8A8A';
      default: return '#8A8A8A';
    }
  };

  // 👇 Apply filter before rendering
  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  return (
    <div className="container py-5" style={{ backgroundColor: '#F9F5F1', minHeight: '100vh' }}>
      <div className="mb-4">
        <button
          className="btn d-flex align-items-center fw-bold"
          style={{
            backgroundColor: '#E8DFD5',
            color: '#B45F3A',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px'
          }}
          onClick={() => navigate('/')}
        >
          <span style={{ transform: 'rotate(180deg)', display: 'inline-block', marginRight: '8px' }}>➜</span>
          Back Home
        </button>
      </div>

      <h1 className="text-center mb-4 fw-bold" style={{ color: '#CD9A5E', fontFamily: 'Segoe UI' }}>
        🛎️ Your Bookings
      </h1>

      {/* 👇 Filter dropdown */}
      <div className="d-flex justify-content-end mb-4">
        <select
          className="form-select w-auto fw-bold"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ backgroundColor: '#E8DFD5', color: '#B45F3A', border: 'none', borderRadius: '8px' }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-center mt-5">No bookings available.</p>
      ) : (
        <div className="row g-4">
          {filteredBookings.map((booking) => {
            const formattedCheckIn = format(new Date(booking.check_in), 'MMM dd, yyyy');
            const formattedCheckOut = format(new Date(booking.check_out), 'MMM dd, yyyy');
            const badgeColor = getBadgeColor(booking.status);

            return (
              <div key={booking.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm" style={{ backgroundColor: '#E8DFD5', border: 'none', borderRadius: '15px' }}>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold text-dark">
                        <FaBed className="me-2" style={{ color: '#B45F3A' }} />
                        {getBookingTitle(booking.hotel, booking.room)}
                      </h5>
                      <span
                        className="badge my-3"
                        style={{
                          backgroundColor: badgeColor,
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '0.9rem'
                        }}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <p className="text-muted">
                        <FaCalendarCheck className="me-2" style={{ color: '#CD9A5E' }} />
                        Check-in: {formattedCheckIn} <br />
                        <FaCalendarTimes className="me-2" style={{ color: '#CD9A5E' }} />
                        Check-out: {formattedCheckOut}
                      </p>
                    </div>

                    <div className="d-flex justify-content-between gap-2 mt-3">
                      <button
                        className="btn btn-sm d-flex align-items-center justify-content-center fw-bold"
                        style={{ backgroundColor: '#CD9A5E', color: 'white', flex: 1 }}
                        onClick={() => navigate(`/my-bookings/${booking.id}`)}
                      >
                        <FaEye className="me-2" /> Details
                      </button>

                      {booking.status !== 'confirmed' && (
                        <>
                          <button
                            className="btn btn-sm d-flex align-items-center justify-content-center fw-bold"
                            style={{ backgroundColor: '#B45F3A', color: 'white', flex: 1 }}
                            onClick={() => navigate(`/my-bookings/${booking.id}/edit`)}
                          >
                            <FaEdit className="me-2" /> Edit
                          </button>
                          <button
                            className="btn btn-sm d-flex align-items-center justify-content-center fw-bold"
                            style={{ backgroundColor: '#8A8A8A', color: 'white', flex: 1 }}
                            onClick={() => {
                              setDeleteBookingId(booking.id);
                              setShowModal(true);
                            }}
                          >
                            <FaTimesCircle className="me-2" /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {bookings.some(b => b.status === 'pending') && (
        <div className="alert alert-warning mt-5 text-center fw-bold" style={{ backgroundColor: '#FFF7E6', color: '#B45F3A' }}>
          📢 Some of your bookings are currently marked as <strong>Pending</strong>. These reservations are <u>not confirmed</u> and may still be booked by others.<br />
          To secure your stay, please complete the <strong>payment</strong>. <br />
          💳 Payment methods are available in the <em>booking details</em> of each pending reservation.
        </div>
      )}

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">Confirm Cancellation</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to cancel this booking?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ backgroundColor: '#B45F3A' }}>Close</button>
                <button type="button" className="btn btn-secondary" onClick={handleDelete} style={{ backgroundColor: '#8A8A8A' }}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingsList;
