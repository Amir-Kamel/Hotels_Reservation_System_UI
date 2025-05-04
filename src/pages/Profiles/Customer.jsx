import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  editCurrentUser,
  clearError,
} from "../../store/slices/accounts";
import { fetchUserBookings } from "../../store/slices/booking";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import './Customer.css'; // Import the CSS

export default function CustomerProfile() {
  const dispatch = useDispatch();
  const { userDetail, loading, error } = useSelector((state) => state.accounts);
  const { bookings } = useSelector((state) => state.bookings);
  
  const [showModal, setShowModal] = useState(false);
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'table'
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Get filtered bookings based on status
  const filteredBookings = bookings?.filter(booking => 
    filterStatus === 'all' ? true : booking.status === filterStatus
  );

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (userDetail) {
      dispatch(fetchUserBookings());
    }
  }, [dispatch, userDetail]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      username: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      phone: document.querySelector('input[name="phone"]').value,
      password: document.querySelector('input[name="Password"]').value,
      password2: document.querySelector('input[name="confirmPassword"]').value,
    };
    dispatch(editCurrentUser(formData));
    setShowModal(false);
  };

  // Function to format date for better display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-state">Loading your profile information...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile Dashboard</h1>
        <Button 
          className="btn-custom"
          onClick={() => setShowModal(true)}
        >
          Edit Profile
        </Button>
      </div>

      <div className="profile-details">
        {userDetail ? (
          <>
            {/* Stats Summary */}
            <div className="stats-summary">
              <div className="stat-card">
                <div className="stat-value">{bookings?.length || 0}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {bookings?.filter(b => b.status === 'confirmed').length || 0}
                </div>
                <div className="stat-label">Confirmed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {bookings?.filter(b => b.status === 'pending').length || 0}
                </div>
                <div className="stat-label">Pending</div>
                
              </div>
              <div className="info-item">
                <strong>Name</strong>
                <p>{userDetail.username}</p>
              </div>
            </div>

            {/* User Information */}
            <div className="user-info-card">
              
              <div className="info-item">
                <strong>Email</strong>
                <p className="text-sm truncate overflow-hidden">{userDetail.email}</p>
              </div>
              <div className="info-item">
                <strong>Phone</strong>
                <p>{userDetail.phone || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <strong>Address</strong>
                <p>{userDetail.address || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <strong>Account Type</strong>
                <p>{userDetail.role}</p>
              </div>
            </div>

            {/* Profile Edit Modal */}
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              backdrop="static"
              centered
              className="custom-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleFormSubmit} className="edit-form">
                  <Form.Group className="form-group">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Name"
                      defaultValue={userDetail.username}
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email"
                      defaultValue={userDetail.email}
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      defaultValue={userDetail.phone}
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="Password"
                      placeholder="New Password"
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="form-control"
                    />
                  </Form.Group>
                  <div className="form-actions">
                    <Button
                      variant="secondary"
                      className="btn-custom btn-cancel"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="btn-custom">
                      Update Profile
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Bookings Section */}
            <div className="bookings-section">
              <div className="bookings-section-header">
                <h2>Your Bookings</h2>
                <div className="view-toggle">
                  <button 
                    className={viewType === 'grid' ? 'active' : ''} 
                    onClick={() => setViewType('grid')}
                  >
                    Grid View
                  </button>
                  <button 
                    className={viewType === 'table' ? 'active' : ''} 
                    onClick={() => setViewType('table')}
                  >
                    Table View
                  </button>
                </div>
              </div>
              
              <div className="filter-controls">
                <select 
                  className="filter-select" 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Bookings</option>
                  <option value="confirmed">Confirmed Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>

              {bookings && bookings.length > 0 ? (
                viewType === 'grid' ? (
                  // Grid View
                  <div className="bookings-grid">
                    {filteredBookings.map((booking) => (
                      <Link
                        to={
                          booking.status !== "confirmed"
                            ? `/bookingdetails/${booking.id}`
                            : "#"
                        }
                        className="booking-card-link"
                        key={booking.id}
                      >
                        <div className="booking-card">
                          <div className="booking-image">
                            <img
                              src={booking.hotel_image}
                              alt={booking.hotel_name}
                            />
                            <span className={`booking-status ${booking.status}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="booking-details">
                            <h3 className="hotel-name">{booking.hotel_name}</h3>
                            <p className="hotel-address">{booking.hotel_address}</p>
                            
                            <div className="booking-info">
                              <div className="booking-date">
                                <strong>Check In</strong>
                                {formatDate(booking.check_in)}
                              </div>
                              <div className="booking-date">
                                <strong>Check Out</strong>
                                {formatDate(booking.check_out)}
                              </div>
                            </div>
                            
                            <div className="price-rating">
                              <span className="price">${booking.total_price}</span>
                              <span className="booking-date">
                                <strong>Booked on</strong>
                                {formatDate(booking.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  // Table View
                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Hotel</th>
                          <th>Dates</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="hotel-cell">
                              <span className="hotel-name">{booking.hotel_name}</span>
                              <span className="hotel-address">{booking.hotel_address}</span>
                            </td>
                            <td className="dates-cell">
                              <span>Check-in: {formatDate(booking.check_in)}</span>
                              <span>Check-out: {formatDate(booking.check_out)}</span>
                              <span className="hotel-rating">Booked: {formatDate(booking.created_at)}</span>
                            </td>
                            <td className="price-cell">
                              <span className="price-amount">${booking.total_price}</span>
                            </td>
                            <td>
                              <span className={`status-badge ${booking.status}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={
                                    booking.status !== "confirmed"
                                      ? `/bookingdetails/${booking.id}`
                                      : "#"
                                  }
                                >
                                  <button className="icon-button view">View Details</button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="empty-state">
                  <p>You haven't made any bookings yet.</p>
                  <Link to="/hotels">
                    <Button className="btn-custom">Browse Hotels</Button>
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>No user details found. Please try logging in again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
