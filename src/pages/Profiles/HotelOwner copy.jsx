import React from "react";
import { Link } from "react-router-dom";
import BookingsCard from "../../components/BookingsCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  editCurrentUser,
  clearError,
} from "../../store/slices/accounts";
import { fetchhotelBookings } from "../../store/slices/booking";
import { fetchOwnerHotelDetails } from "../../store/slices/hotels";
import "./HotelOwner.css";
import { useEffect, useState } from "react";

// get owner personl data (done)
// add form to update owner personal data (done)
// get hotel data (done)
// get hotel reviews or view in hotel details (done)
// get hotel bookings (done)

export default function HotelOwner() {
  const dispatch = useDispatch();
  const { userDetail, loading, error } = useSelector((state) => state.accounts);
  const { bookings } = useSelector((state) => state.bookings);
  const { hotelDetail } = useSelector((state) => state.hotels);
  console.log(userDetail, "userDetail");
  console.log(hotelDetail, "hotelDetail");
  console.log(bookings, "bookings");

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // fetch hotel bookings
  useEffect(() => {
    if (userDetail) {
      dispatch(fetchhotelBookings());
    }
  }, [dispatch, userDetail]);

  // fetch hotel details
  useEffect(() => {
    if (userDetail) {
      dispatch(fetchOwnerHotelDetails());
    }
  }, [dispatch, userDetail]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000); // Clear after 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or re-run
    }
  }, [error, dispatch]);

  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => setShowForm(true);

  const handleFormSuccess = (e) => {
    e.preventDefault(); // prevent default form submission
    const formData = {
      username: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      phone: document.querySelector('input[name="phone"]').value,
      password: document.querySelector('input[name="Password"]').value,
      password2: document.querySelector('input[name="confirmPassword"]').value,
    };
    dispatch(editCurrentUser(formData));
    setShowForm(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
      </div>
      <div className="profile-info">
        <div className="profile-details mt-3">
          <h2>Personal Info</h2>
          {userDetail ? (
            <div>
              <p>
                <strong>Name:</strong> {userDetail.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetail.email}
              </p>
              <p>
                <strong>Phone:</strong> {userDetail.phone}
              </p>
              <p>
                <strong>Address:</strong> {userDetail.address}
              </p>
              <p>
                <strong>Role:</strong> {userDetail.role}
              </p>
              {!showForm ? (
                <button className="btn btn-custom" onClick={handleButtonClick}>
                  Edit
                </button>
              ) : (
                <button
                  className="btn btn-custom"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          ) : (
            <p>No user details found.</p>
          )}
        </div>
        <div className="hotel-details mt-3">
          <h2>Your Hotel </h2>
          {hotelDetail && hotelDetail.length > 0 ? (
            <div>
              <p>
                <strong>Hotel Name:</strong> {hotelDetail[0].name}
              </p>
              <p>
                <strong>Email: </strong> {hotelDetail[0].email}
              </p>
              <p>
                <strong>Phone:</strong> {hotelDetail[0].phone}
              </p>
              <p>
                <strong>Hotel Address:</strong> {hotelDetail[0].address}
              </p>
              <p>
                <strong>Hotel Rating:</strong> {hotelDetail[0].stars} Stars
              </p>
            </div>
          ) : (
            <p>No hotel details found.</p>
          )}
          {hotelDetail && hotelDetail.length > 0 ? (
            <div>
              <Link
                to={`/hotel/${hotelDetail[0].id}`}
                className="btn btn-custom "
              >
                Details
              </Link>
            </div>
          ) : (
            <p></p>
          )}
        </div>
      </div>
      <div className="edit-form">
        {showForm && (
          <form className="mt-4" onSubmit={handleFormSuccess}>
            <input
              type="text"
              className="form-control mb-2"
              name="name"
              placeholder="Name"
              defaultValue={userDetail.name}
            />
            <input
              type="email"
              className="form-control mb-2"
              name="email"
              placeholder="Email"
              defaultValue={userDetail.email}
            />
            <input
              type="text"
              className="form-control mb-2"
              name="phone"
              placeholder="Phone"
              defaultValue={userDetail.phone}
            />
            <input
              type="password"
              className="form-control mb-2"
              name="Password"
              placeholder="New Password"
            />
            <input
              type="password"
              className="form-control mb-2"
              name="confirmPassword"
              placeholder="Confirm Password"
            />
            <button type="submit" className="btn btn-custom">
              Update
            </button>
          </form>
        )}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
      <div className="mt-5 hotel-bookings">
        <h2>Your Hotel Bookings</h2>
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <Link
              to={`/my-bookings/${booking.id}`}
              className="text-decoration-none text-dark"
              key={booking.id}
            >
              <BookingsCard
                key={booking.id}
                hotelimage={booking.hotel_image}
                bookingDate={booking.created_at}
                clientName={booking.client_name}
                roomtype={booking.room_type}
                checkinDate={booking.check_in}
                checkOutDate={booking.check_out}
                hotelrating={booking.hotelRating}
                bookingPrice={booking.total_price}
                bookingStatus={booking.status}
              />
            </Link>
          ))
        ) : (
          <p>No bookings Yet.</p>
        )}
      </div>
    </div>
  );
}
