import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingDetail, deleteBooking } from '../../store/slices/booking';
import { getAllHotels } from '../../services/api';
import { FaCalendarAlt, FaArrowRight, FaTimesCircle, FaEdit, FaMoneyBillWave, FaCheckCircle, FaArrowLeft, FaHome, FaDollarSign } from 'react-icons/fa';
import { format } from 'date-fns';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.bookings.selectedBooking);
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
  const token = localStorage.getItem('access');
  const user = localStorage.getItem('user');
  const [showDatePassedMessage, setShowDatePassedMessage] = useState(false);
  const today = new Date();


  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    } else {
      dispatch(fetchBookingDetail(id));
      getAllHotels()
        .then((res) => setHotels(res.data))
        .catch(() => console.error('Failed to load hotels.'));
    }
  }, [id, navigate, dispatch, token, user]);

  const getBookingTitle = (hotelId, roomId) => {
    const hotel = hotels.find(h => h.id === Number(hotelId));
    if (!hotel) return `Hotel ${hotelId} – Room ${roomId}`;
  
    const room = hotel.rooms?.find(r => r.id === Number(roomId));
    if (!room) return `${hotel.name} – Room ${roomId}`;
  
    return `${hotel.name} – ${room.room_type?.room_type}`;
  };

  const handleDelete = () => {
    dispatch(deleteBooking(id)).then(() => {
      navigate('/my-bookings');
    }).catch((err) => {
      console.error('Delete Booking Error:', err);
    });
    setShowModal(false);  // Close the modal after deletion
  };

  useEffect(() => {
    if (booking && booking.check_in) {  // Ensure booking and check_in exist
        const checkInDate = new Date(booking.check_in);
        if (checkInDate < today && booking.status === 'pending') {
            setShowDatePassedMessage(true);
        } else {
            setShowDatePassedMessage(false);  // Optionally reset the state if no conflict
        }
    }
}, [booking, today]);  // Add `today` to dependencies if necessary


  const calculateNights = () => {
    if (!booking) return 0;
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };


  if (!booking) {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center p-5 border rounded shadow" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
          <i className="fas fa-exclamation-triangle fa-4x mb-3"></i>
          <h2 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Booking Not Found</h2>
          <p className="mt-3" style={{ fontSize: '1.2rem' }}>
            😕 We couldn't find the booking you're looking for.<br />
            It's possible it was deleted or never existed.
          </p>
          <button
            className="btn btn-warning mt-4"
            onClick={() => navigate('/my-bookings')}
            style={{ fontSize: '1rem', fontWeight: 'bold' }}
          >
            <i className="fas fa-arrow-left me-2"></i>Go Back To Your Bookings List
          </button>
        </div>
      </div>
    );
  }
  

  const formattedCheckInDate = booking.check_in
    ? format(new Date(booking.check_in), 'MMM dd, yyyy')
    : 'Invalid date';

  const formattedCheckOutDate = booking.check_out
    ? format(new Date(booking.check_out), 'MMM dd, yyyy')
    : 'Invalid date';

  const isDisabled = booking.status === 'confirmed';

  return (
    
    <div className="container py-5" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
      <div className="card shadow-lg" style={{ backgroundColor: '#F9F5F1', borderRadius: '12px' }}>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn text-white"
              style={{ backgroundColor: '#8A8A8A', fontWeight: 'bold', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
              onClick={() => navigate('/my-bookings')}
            >
              <FaArrowLeft className="me-2" /> My Bookings
            </button>

            <button
              className="btn text-white"
              style={{ backgroundColor: '#8A8A8A', fontWeight: 'bold', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
              onClick={() => navigate('/')}
            >
              <FaHome className="me-2" /> Home
            </button>
          </div>

          <h3 className="text-center fw-bold mb-4" style={{ color: '#CD9A5E' }}>
            {getBookingTitle(booking.hotel, booking.room)}
          </h3>

          <div className="row text-center mb-4 g-3">
            <div className="col-md-4">
              <div className="p-3 rounded" style={{ backgroundColor: '#E8DFD5' }}>
                <FaCalendarAlt className="mb-2" size={20} color="#CD9A5E" />
                <div><strong>Check-in:</strong></div>
                <div>{formattedCheckInDate}</div>
              </div>
            </div>

            <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
              <FaArrowRight size={24} color="#CD9A5E" />
              <span className="mt-2">{calculateNights()} Day{calculateNights() !== 1 ? 's' : ''}</span>
            </div>

            <div className="col-md-4">
              <div className="p-3 rounded" style={{ backgroundColor: '#E8DFD5' }}>
                <FaCalendarAlt className="mb-2" size={20} color="#CD9A5E" />
                <div><strong>Check-out:</strong></div>
                <div>{formattedCheckOutDate}</div>
              </div>
            </div>
          </div>

          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item d-flex justify-content-between">
              <span><FaDollarSign className="me-2 text-success" />Total Price:</span>
              <span className="fw-bold" style={{ color: '#B45F3A' }}>${booking.total_price}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span><FaCheckCircle className="me-2 text-info" />Status:</span>
              <span className="text-capitalize">{booking.status}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span><FaMoneyBillWave className="me-2 text-success" />Payment:</span>
              <span className="text-capitalize">{booking.payment_status}</span>
            </li>
          </ul>


            {/* Status-based messages */}
            {booking.status === 'pending' && booking.has_conflict && (
            <div className="alert alert-danger mt-4" role="alert" style={{ fontSize: '1rem', backgroundColor: '#F8D7DA', borderColor: '#F5C6CB', color: '#721C24' }}>
              ⚠️ This booking is pending, but another guest has already confirmed the room for overlapping dates from <strong>{format(new Date(booking.check_in), 'MMM dd, yyyy')}</strong> to <strong>{format(new Date(booking.check_out), 'MMM dd, yyyy')}</strong>.
              Please cancel this booking and let's make a new or edit your booking in available dates.
            </div>
          )}

            {booking.status === 'pending' && showDatePassedMessage && (
                <div className="alert alert-warning mt-4" role="alert" style={{ fontSize: '1rem', backgroundColor: '#FFF3CD', borderColor: '#FFEEBA', color: '#856404' }}>
                    ⚠️ Your check-in date has already passed, but your booking is still <strong>pending</strong> and till now you didn't <u>confirm</u> your booking.<br />
                    Please either cancel your booking and make a new one or edit your booking with available dates.
                </div>
            )}

          {!booking.has_conflict && booking.status === 'pending' && !showDatePassedMessage && (
            <div className="alert alert-warning mt-4" role="alert" style={{ fontSize: '1rem', backgroundColor: '#FFF3CD', borderColor: '#FFEEBA', color: '#856404' }}>
              📢 This booking is currently marked as <strong>Pending</strong>. It is <u>not confirmed</u> and may still be booked by others. If the check-in date passes without confirming your booking, the process will be stopped.<br />
              To secure your stay, please complete the <strong>payment</strong> below.
            </div>
          )}

          {booking.status === 'confirmed' && (
            <div className="alert alert-success mt-4" role="alert" style={{ fontSize: '1rem', backgroundColor: '#D4EDDA', borderColor: '#C3E6CB', color: '#155724' }}>
              🎉 Your booking is <strong>Confirmed</strong>!<br />
              Thank you for choosing us — we look forward to hosting you on <strong>{format(new Date(booking.check_in), 'MMM dd, yyyy')}</strong>.<br />
              🛏️ Wishing you a pleasant and relaxing stay, and we can’t wait to meet you at check-in!
            </div>
          )}

          <div className="d-flex justify-content-between flex-wrap gap-3">
            {!isDisabled && (
              <button
                className="btn text-white flex-fill"
                style={{ backgroundColor: '#CD9A5E' }}
                onClick={() => navigate(`/my-bookings/${id}/edit`)}
              >
                <FaEdit className="me-2" /> Edit Booking
              </button>
            )}

            {!isDisabled && !booking.has_conflict && !showDatePassedMessage && (
              <button
                className="btn text-white flex-fill"
                style={{ backgroundColor: '#B45F3A' }}
              >
                💳 Pay Now
              </button>
            )}


            {!isDisabled && (
              <button
                className="btn text-white flex-fill"
                style={{ backgroundColor: '#8A8A8A' }}
                onClick={() => setShowModal(true)}  // Open modal on button click
              >
                <FaTimesCircle className="me-2" /> Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Delete Confirmation */}
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

export default BookingDetails;
