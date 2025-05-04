import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentAdmin,
  fetchUsers,
  clearError,
  editCurrentAdmindata,
  createUserForAdmin,
} from "../../store/slices/accounts";
import { fetchAllBookings } from "../../store/slices/booking";
import { fetchHotels } from "../../store/slices/hotels";
import { Modal, Button, Form } from "react-bootstrap";
import "./AdminPanel.css";

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { userDetail, error, users ,formError } = useSelector((state) => state.accounts);
  const { bookings } = useSelector((state) => state.bookings);
  const { hotels } = useSelector((state) => state.hotels);
  const [formErrors,setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "hotel_owner",
    password: "",
    password2: "",
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [showUserDataEditForm, setShowUserDataEditForm] = useState(false);
  const [showUserRegisterForm, setShowUserRegisterForm] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [hotelFilter, setHotelFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchCurrentAdmin());
    dispatch(fetchUsers());
    dispatch(fetchHotels());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  useEffect(() => {
    if (userDetail) {
      setFormData({
        username: userDetail.username || "",
        email: userDetail.email || "",
        phone: userDetail.phone || "",
        password: "",
        password2: "",
      });
    }
  }, [userDetail]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleUserRoleFilterChange = (e) => {
    setUserRoleFilter(e.target.value);
  };

  const handleBookingStatusFilterChange = (e) => {
    setBookingStatusFilter(e.target.value);
  };

  const handleHotelFilterChange = (e) => {
    setHotelFilter(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (userRoleFilter === "all") return true;
    return user.role === userRoleFilter;
  });

  const filteredBookings = bookings.filter((booking) => {
    if (bookingStatusFilter === "all") return true;
    return booking.status === bookingStatusFilter;
  });

  const filteredHotels = hotels.filter((hotel) => {
    if (hotelFilter === "all") return true;
    return hotel.stars === parseInt(hotelFilter);
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleFormSuccess = async (e) => {
    e.preventDefault();
    await dispatch(editCurrentAdmindata(formData));
    dispatch(fetchCurrentAdmin());
    setShowUserDataEditForm(false);
  };
  useEffect(()=>{
    if(formError){
      setFormErrors(formError)
      console.log(formError)
    }
  },[formError])
  const handleUserRegisterFormSuccess = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(createUserForAdmin(registerFormData));
      if (createUserForAdmin.fulfilled.match(resultAction)) {
        dispatch(fetchUsers());
        setShowUserRegisterForm(false);
        setFormErrors({});
      } else {
        console.log("Form submission failed with errors.");
      }
    } catch (err) {
      console.log("Unexpected error:", err);
    }
  };
  
  const getSummaryStats = () => {
    return {
      totalUsers: users.length,
      totalHotels: hotels.length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed")
        .length,
      hotelOwners: users.filter((u) => u.role === "hotel_owner").length,
      customers: users.filter((u) => u.role === "customer").length,
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="admin-dashboard">
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>HotelAdmin</h2>
          </div>
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>
        <div className="admin-info">
          {userDetail && (
            <div className="admin-avatar">
              <div className="avatar-circle">
                {userDetail.username?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="admin-name">{userDetail.username}</div>
              <div className="admin-role">Administrator</div>
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button
            className={activeSection === "personal" ? "active" : ""}
            onClick={() => setActiveSection("personal")}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">My Profile</span>
          </button>
          <button
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Users</span>
          </button>
          <button
            className={activeSection === "bookings" ? "active" : ""}
            onClick={() => setActiveSection("bookings")}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">Bookings</span>
          </button>
          <button
            className={activeSection === "hotels" ? "active" : ""}
            onClick={() => setActiveSection("hotels")}
          >
            <span className="nav-icon">🏨</span>
            <span className="nav-text">Hotels</span>
          </button>
        </nav>
      </div>
      <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <header className="dashboard-header">
          <div className="page-title">
            {activeSection === "dashboard" && <h1>Dashboard Overview</h1>}
            {activeSection === "personal" && <h1>My Profile</h1>}
            {activeSection === "users" && <h1>User Management</h1>}
            {activeSection === "bookings" && <h1>Booking Management</h1>}
            {activeSection === "hotels" && <h1>Hotel Management</h1>}
          </div>
        </header>
        <div className="content-wrapper">
          {activeSection === "dashboard" && (
            <div className="dashboard-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalHotels}</div>
                  <div className="stat-label">Hotels</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalBookings}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.pendingBookings}</div>
                  <div className="stat-label">Pending Bookings</div>
                </div>
              </div>

              <div className="dashboard-charts">
                <div className="dashboard-card recent-users">
                  <h3>Recent Users</h3>
                  <div className="recent-users-list">
                    {users.slice(0, 5).map((user) => (
                      <div className="recent-user" key={user.id}>
                        <div className="user-avatar">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <div className="user-name">{user.username}</div>
                          <div className="user-role">{user.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card recent-bookings">
                  <h3>Latest Bookings</h3>
                  <div className="recent-bookings-list">
                    {bookings.slice(0, 5).map((booking) => (
                      <div className="recent-booking" key={booking.id}>
                        <div className="booking-info">
                          <div className="booking-hotel">
                            {booking.hotel_name}
                          </div>
                          <div className="booking-dates">
                            {booking.check_in} to {booking.check_out}
                          </div>
                        </div>
                        <div className={`booking-status ${booking.status}`}>
                          {booking.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dashboard-row">
                <div className="dashboard-card user-distribution">
                  <h3>User Distribution</h3>
                  <div className="distribution-stats">
                    <div className="distribution-item">
                      <div className="distribution-label">Hotel Owners</div>
                      <div className="distribution-bar">
                        <div
                          className="distribution-fill hotel-owners"
                          style={{
                            width: `${
                              (stats.hotelOwners / stats.totalUsers) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="distribution-value">
                        {stats.hotelOwners}
                      </div>
                    </div>
                    <div className="distribution-item">
                      <div className="distribution-label">Customers</div>
                      <div className="distribution-bar">
                        <div
                          className="distribution-fill customers"
                          style={{
                            width: `${
                              (stats.customers / stats.totalUsers) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="distribution-value">
                        {stats.customers}
                      </div>
                    </div>
                    <div className="distribution-item">
                      <div className="distribution-label">Admins</div>
                      <div className="distribution-bar">
                        <div
                          className="distribution-fill admins"
                          style={{
                            width: `${
                              ((stats.totalUsers -
                                stats.hotelOwners -
                                stats.customers) /
                                stats.totalUsers) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="distribution-value">
                        {stats.totalUsers - stats.hotelOwners - stats.customers}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "personal" && (
            <div className="profile-section">
              <div className="profile-card">
                {userDetail ? (
                  <div className="profile-content">
                    <div className="profile-header">
                      <div className="profile-avatar">
                        {userDetail.username?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div className="profile-title">
                        <h2>{userDetail.username}</h2>
                        <span className="admin-badge">{userDetail.role}</span>
                      </div>
                    </div>

                    <div className="profile-details">
                      <div className="detail-group">
                        <h3>Contact Information</h3>
                        <div className="detail-row">
                          <div className="detail-label">Email</div>
                          <div className="detail-value">{userDetail.email}</div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Phone</div>
                          <div className="detail-value">
                            {userDetail.phone || "Not provided"}
                          </div>
                        </div>
                      </div>

                      <div className="detail-group">
                        <h3>Account Settings</h3>
                        <div className="detail-row">
                          <div className="detail-label">Status</div>
                          <div className="detail-value">
                            <span className="status-active">Active</span>
                          </div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Last Login</div>
                          <div className="detail-value">Today, 9:30 AM</div>
                        </div>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button
                        className="primary-button"
                        onClick={() => setShowUserDataEditForm(true)}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="loading-profile">
                    Loading profile information...
                  </div>
                )}
              </div>

              <Modal
                show={showUserDataEditForm}
                onHide={() => setShowUserDataEditForm(false)}
                centered
                className="custom-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleFormSuccess}>
                    <Form.Group controlId="username" className="form-group">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="Name"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    </Form.Group>

                    <Form.Group controlId="email" className="form-group">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </Form.Group>

                    <Form.Group controlId="phone" className="form-group">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </Form.Group>

                    <Form.Group controlId="password" className="form-group">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Old Password"
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </Form.Group>

                    <Form.Group controlId="password2" className="form-group">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password2"
                        placeholder="New Password"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password2: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <div className="modal-actions">
                      <Button
                        variant="secondary"
                        onClick={() => setShowUserDataEditForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" className="border-0" type="submit">
                        Update Profile
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
          )}

          {activeSection === "users" && (
            <div className="users-section">
              <div className="section-controls">
                <div className="filter-controls">
                  <select
                    onChange={handleUserRoleFilterChange}
                    value={userRoleFilter}
                    className="filter-select"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="hotel_owner">Hotel Owner</option>
                    <option value="customer">Client</option>
                  </select>
                </div>
                <div className="action-controls">
                  <button
                    className="primary-button"
                    onClick={() => setShowUserRegisterForm(true)}
                  >
                    Add New User
                  </button>
                </div>
              </div>

              <div className="data-table-container">
                {users && users.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-small">
                                {user.username?.charAt(0).toUpperCase()}
                              </div>
                              <span>{user.username}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.phone || "—"}</td>
                          <td>{user.address || "—"}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                user.status ? "active" : "blocked"
                              }`}
                            >
                              {user.status ? "Active" : "Blocked"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="icon-button edit">Edit</button>
                              <button className="icon-button delete">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data">No users found.</div>
                )}
              </div>

              <Modal
                show={showUserRegisterForm}
                onHide={() => setShowUserRegisterForm(false)}
                centered
                className="custom-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleUserRegisterFormSuccess}>
                    <Form.Group controlId="username" className="form-group">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="Name"
                        onChange={(e) =>
                          setRegisterFormData({
                            ...registerFormData,
                            username: e.target.value,
                          })
                        }
                      />
                      {formErrors?.username?.[0] && (
                      <div className="invalid-feedback d-block">{formErrors.username}</div>)}
                    </Form.Group>

                    <Form.Group controlId="email" className="form-group">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={`form-group ${formErrors.email ? "is-invalid" : ""}`}
                        onChange={(e) =>
                          setRegisterFormData({
                            ...registerFormData,
                            email: e.target.value,
                          })
                        }
                      />
                      {formErrors?.email?.[0] && (
                      <div className="invalid-feedback d-block">{formErrors.email}</div>)}
                    </Form.Group>

                    <Form.Group controlId="phone" className="form-group">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className={`form-group ${formErrors.phone ? "is-invalid" : ""}`}
                        onChange={(e) =>
                          setRegisterFormData({
                            ...registerFormData,
                            phone: e.target.value,
                          })
                        }
                      />
                      {formErrors?.phone?.[0] && (
                      <div className="invalid-feedback d-block">{formErrors.phone}</div>)}
                    </Form.Group>

                    <Form.Group controlId="role" className="form-group">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        as="select"
                        name="role"
                        className={`form-group ${formErrors.role ? "is-invalid" : ""}`}
                        onChange={(e) =>
                          setRegisterFormData({
                            ...registerFormData,
                            role: e.target.value,
                          })
                        }
                      >
                        <option value="customer">Client</option>
                        <option value="hotel_owner">Hotel Owner</option>
                        <option value="admin">Admin</option>
                      </Form.Control>
                      {formErrors?.role?.[0] && (
                      <div className="invalid-feedback d-block">{formErrors.role}</div>)}
                    </Form.Group>

                    <Form.Group controlId="password" className="form-group">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={`form-group ${formErrors.password ? "is-invalid" : ""}`}
                        onChange={(e) =>
                          setRegisterFormData({
                            ...registerFormData,
                            password: e.target.value,
                          })
                        }
                      />
                      {formErrors?.password?.[0] && (
                      <div className="invalid-feedback d-block">{formErrors.password}</div>)}
                    </Form.Group>

                    <Form.Group controlId="password2" className="form-group">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password2"
                        className={`form-group ${formErrors.password2 ? "is-invalid" : ""}`}
                        placeholder="Confirm Password"
                        onChange={(e) =>
                          setRegisterFormData({
                            ...registerFormData,
                            password2: e.target.value,
                          })
                        }
                      />
                      {formErrors?.password2?.[0] && (
                      <div className="invalid-feedback d-block">{formErrors.password2}</div>)}
                    </Form.Group>

                    <div className="modal-actions">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setFormErrors({});
                          setShowUserRegisterForm(false)}}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit">
                        Create User
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
          )}

          {activeSection === "bookings" && (
            <div className="bookings-section">
              <div className="section-controls">
                <div className="filter-controls">
                  <select
                    onChange={handleBookingStatusFilterChange}
                    value={bookingStatusFilter}
                    className="filter-select"
                  >
                    <option value="all">All Bookings</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="data-table-container">
                {bookings && bookings.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Hotel</th>
                        <th>Client</th>
                        <th>Room Type</th>
                        <th>Dates</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div className="hotel-cell">
                              <div className="hotel-name">
                                {booking.hotel_name}
                              </div>
                              <div className="hotel-address">
                                {booking.hotel_address}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="client-cell">
                              <div className="client-name">
                                {booking.client_name}
                              </div>
                              <div className="client-email">
                                {booking.client_email}
                              </div>
                            </div>
                          </td>
                          <td>{booking.room_type}</td>
                          <td>
                            <div className="dates-cell">
                              <div>Check-in: {booking.check_in}</div>
                              <div>Check-out: {booking.check_out}</div>
                            </div>
                          </td>
                          <td>
                            <div className="price-cell">
                              <div className="price-amount">
                                ${booking.total_price}
                              </div>
                              <div className="hotel-rating">
                                {booking.hotelRating} ★
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="icon-button view">View</button>
                              <button className="icon-button edit">Edit</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data">No bookings found.</div>
                )}
              </div>
            </div>
          )}

          {activeSection === "hotels" && (
            <div className="hotels-section">
              <div className="section-controls">
                <div className="filter-controls">
                  <select
                    onChange={handleHotelFilterChange}
                    value={hotelFilter}
                    className="filter-select"
                  >
                    <option value="all">All Hotels</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                    <option value="6">6 Stars</option>
                    <option value="7">7 Stars</option>
                  </select>
                </div>
                <div className="action-controls">
                  <button className="primary-button">Add New Hotel</button>
                </div>
              </div>

              <div className="data-table-container">
                {hotels && hotels.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Hotel Name</th>
                        <th>Address</th>
                        <th>Contact</th>
                        <th>Stars</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHotels.map((hotel) => (
                        <tr key={hotel.id}>
                          <td>
                            <div className="hotel-name-cell">
                              <strong>{hotel.name}</strong>
                              <div className="hotel-description-preview">
                                {hotel.description?.substring(0, 60)}...
                              </div>
                            </div>
                          </td>
                          <td>{hotel.address}</td>
                          <td>
                            <div>
                              <div>{hotel.email}</div>
                              <div>{hotel.phone}</div>
                            </div>
                          </td>
                          <td>
                            <div className="hotel-stars">
                              {hotel.stars} <span className="star-icon">★</span>
                            </div>
                          </td>
                          <td>
                            {new Date(hotel.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="icon-button view">View</button>
                              <button className="icon-button edit">Edit</button>
                              <button className="icon-button delete">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data">No hotels found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
