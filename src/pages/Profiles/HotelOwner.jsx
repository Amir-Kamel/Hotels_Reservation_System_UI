import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, editCurrentUser } from "../../store/slices/accounts";
import { fetchOwnerHotelBookings } from "../../store/slices/booking";
import { Modal, Button, Form, Table, Badge } from "react-bootstrap";

export default function HotelOwner() {
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => state.accounts);
  const { bookings } = useSelector((state) => state.bookings);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [showUserDataEditForm, setshowUserDataEditForm] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [hotelFilter, setHotelFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchOwnerHotelBookings());
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

  const filteredBookings = bookings.filter((booking) => {
    if (bookingStatusFilter === "all") return true;
    return booking.status === bookingStatusFilter;
  });

  const filteredBookingsByHotel = filteredBookings.filter((booking) => {
    if (hotelFilter === "all") return true;
    return booking.hotel_name === hotelFilter;
  });

  const handleBookingStatusFilterChange = (e) => {
    setBookingStatusFilter(e.target.value);
  };

  const handleHotelFilterChange = (e) => {
    setHotelFilter(e.target.value);
  };

  const handleFormSuccess = async (e) => {
    e.preventDefault();
    await dispatch(editCurrentUser(formData));
    dispatch(fetchCurrentUser());
    setshowUserDataEditForm(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge bg="success">Confirmed</Badge>;
      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Pending
          </Badge>
        );
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#F9F5F1",
      color: "#1A1A1A",
      fontFamily: "Arial, sans-serif",
    },
    sidebar: {
      width: "220px",
      backgroundColor: "#E8DFD5",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    sidebarButton: {
      backgroundColor: "#CD9A5E",
      color: "#F9F5F1",
      border: "none",
      padding: "10px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    content: {
      flex: 1,
      padding: "30px",
    },
    profileSection: {
      backgroundColor: "#FFFFFF",
      padding: "30px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    h2: {
      color: "#B45F3A",
      marginBottom: "20px",
    },
    paragraph: {
      marginBottom: "10px",
    },
    editButton: {
      backgroundColor: "#CD9A5E",
      border: "none",
      padding: "10px 20px",
      color: "#F9F5F1",
      fontWeight: "bold",
      borderRadius: "5px",
      marginTop: "15px",
    },
    filters: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    table: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #dee2e6",
      fontSize: "14px",
      textAlign: "center",
    },
    tableHead: {
      backgroundColor: "#E8DFD5",
    },
    tableCellBold: {
      fontWeight: "bold",
    },
    noBookings: {
      color: "#8A8A8A",
      textAlign: "center",
      marginTop: "20px",
    },
    select: {
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #CD9A5E",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <button
          style={styles.sidebarButton}
          onClick={() => setActiveSection("personal")}
        >
          Hotel Owner Personal Data
        </button>
        <button
          style={styles.sidebarButton}
          onClick={() => setActiveSection("bookings")}
        >
          Bookings
        </button>
      </div>

      <div style={styles.content}>
        {activeSection === "personal" && (
          <div style={styles.profileSection}>
            <h2 style={styles.h2}>Hotel Owner Personal Info</h2>
            {userDetail ? (
              <div>
                <p style={styles.paragraph}>
                  <strong>Name:</strong> {userDetail.username}
                </p>
                <p style={styles.paragraph}>
                  <strong>Email:</strong> {userDetail.email}
                </p>
                <p style={styles.paragraph}>
                  <strong>Phone:</strong> {userDetail.phone}
                </p>
                <p style={styles.paragraph}>
                  <strong>Role:</strong> {userDetail.role}
                </p>
                <button
                  style={styles.editButton}
                  onClick={() => setshowUserDataEditForm(!showUserDataEditForm)}
                >
                  {showUserDataEditForm ? "Cancel" : "Edit"}
                </button>
              </div>
            ) : (
              <p>Loading...</p>
            )}

            <Modal
              show={showUserDataEditForm}
              onHide={() => setshowUserDataEditForm(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Hotel Owner Info</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleFormSuccess}>
                  <Form.Group controlId="username">
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

                  <Form.Group controlId="email">
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

                  <Form.Group controlId="phone">
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

                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="password2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password2"
                      placeholder="Confirm Password"
                      onChange={(e) =>
                        setFormData({ ...formData, password2: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-3">
                    Update
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        )}

        {activeSection === "bookings" && (
          <div>
            <h2 style={styles.h2}>Bookings</h2>

            <div style={styles.filters}>
              <select
                onChange={handleBookingStatusFilterChange}
                value={bookingStatusFilter}
                style={styles.select}
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>

              <select
                onChange={handleHotelFilterChange}
                value={hotelFilter}
                style={styles.select}
              >
                <option value="all">All Hotels</option>
                {Array.from(new Set(bookings.map((b) => b.hotel_name))).map(
                  (hotelName, index) => (
                    <option key={`${hotelName}-${index}`} value={hotelName}>
                      {hotelName}
                    </option>
                  )
                )}
              </select>
            </div>

            {filteredBookingsByHotel.length > 0 ? (
              <Table striped bordered hover responsive style={styles.table}>
                <thead style={styles.tableHead}>
                  <tr>
                    <th>Hotel Name</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Booking Date</th>
                    <th>Client Name</th>
                    <th>Client Email</th>
                    <th>Client Phone</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookingsByHotel.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.hotel_name}</td>
                      <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                      <td>
                        {new Date(booking.check_out).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td>{booking.client_name}</td>
                      <td>{booking.client_email}</td>
                      <td>{booking.client_phone}</td>
                      <td style={styles.tableCellBold}>
                        ${booking.total_price}
                      </td>
                      <td>{getStatusBadge(booking.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p style={styles.noBookings}>No bookings found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
