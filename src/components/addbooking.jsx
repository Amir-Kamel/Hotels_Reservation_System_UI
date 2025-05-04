import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelDetail } from "../store/slices/hotels";
import { addBooking } from "../store/slices/booking";
import { fetchHotelRoomsType } from "../store/slices/rooms";

export default function BookingForm() {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hotel_Id } = useParams();
  const { hotelRoomTypes } = useSelector((state) => state.rooms);
  const { formError } = useSelector((state) => state.bookings);
 
  const [checkIn, setCheckIn] = useState("");
  const [days, setDays] = useState(1);
  const [items, setItems] = useState([{ room_type_id: "", quantity: 1 }]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchHotelDetail(hotel_Id));
    dispatch(fetchHotelRoomsType(hotel_Id));
  }, [dispatch, hotel_Id]);

  useEffect(() => {
    if (formError) {
      console.log(formError)
      setFormErrors(formError);
    }
    console.log("the errors is : ",formErrors)
  }, [formError]);

  const handleItemChange = (index, e) => {
    const newItems = [...items];
    newItems[index][e.target.name] = e.target.value;
    setItems(newItems);
  };
  const addItem = () => {
    setItems([...items, { room_type_id: "", quantity: 1 }]);
  };
  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      user: userId,
      hotel: parseInt(hotel_Id),
      check_in: checkIn,
      days: parseInt(days),
      item_inputs: items.map((item) => ({
        room_type_id: parseInt(item.room_type_id),
        quantity: parseInt(item.quantity),
      })),
    };
    try {
      const response = await dispatch(addBooking(data)).unwrap();
      console.log("Booking created successfully:", response);
      const bookingId = response.booking_id;
      navigate(`/bookingdetails/${bookingId}/`);
    } catch(error){
      console.error("Server error:", error);
    }
  };

  return (
    <div className="container py-5">
      <div className="booking-form mx-auto p-4 shadow">
        <h2 className="text-center mb-4 booking-title">Book Your Stay</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Check-in Date:</label>
            <input
              type="date"
              className={`form-control ${formErrors.check_in ? "is-invalid" : ""}`}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
            {formErrors?.check_in?.[0] && (
            <div className="invalid-feedback d-block">{formErrors.check_in[0]}</div>)}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Days:</label>
            <input
              type="number"
              className="form-control"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
            />
          </div>
          <h4 className="mb-3">Room Items</h4>
          {items.map((item, index) => (
            <div key={index} className="row justify-content-between p-3 mb-2">
              <div className="col-md-6 col-sm-12">
                <label className="form-label fw-semibold">Room Type:</label>
                <select
                  name="room_type_id"
                  className={`form-select ${formErrors.room_type ? "is-invalid" : ""}`}
                  value={item.room_type_id}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                >
                  <option value="">Select Room Type</option>
                  {hotelRoomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.room_type}
                    </option>
                  ))}
                </select>
                {formErrors?.item_inputs?.[0] && (
                <div className="invalid-feedback d-block">{formErrors.item_inputs}</div>)}
              </div>
              <div className="col-md-4 col-sm-12">
                <label className="form-label fw-semibold">Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  className={`form-control ${formErrors.quantity ? "is-invalid" : ""}`}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
                {formErrors?.quantity?.[0] && (
                <div className="invalid-feedback d-block">{formErrors.quantity}</div>)}
              </div>
              <div className="col-1 d-flex justify-content-center">
                <button type="button" className="btn btn-danger align-self-center" onClick={() => removeItem(index)}>
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-between p-3">
          <button type="button" className="btn btn-secondary btn-sm m-3" onClick={addItem}>
            + Add Room
          </button>
            <button type="submit" className="btn booking-btn">
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
