import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPaymentDetail } from "../store/slices/payments";

const BookingDetail = () => {
  const { UserId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentDetail } = useSelector((state) => state.payments || {});

  useEffect(() => {
    dispatch(fetchPaymentDetail(UserId));
  }, [dispatch, UserId]);

  const handlePayment = () => {
    if (paymentDetail && paymentDetail.id) {
      navigate(`/payment/client-info/${paymentDetail.id}`);
    } else {
      console.error("Payment detail or ID is missing");
    }
  };

  if (!paymentDetail) {
    return <p className="text-center text-secondary">Loading booking details...</p>;
  }

  return (
    <div className="booking-details container py-5">
      <h2 className="text-center booking-title mb-4">Booking Details</h2>

      <div className="card booking-card shadow-sm mx-auto">
        <div className="card-header text-center bg-primary text-light">
          <h4>Hotel: {paymentDetail.hotel?.name}</h4>
        </div>
        <div className="card-body">
          <p><strong>Address:</strong> {paymentDetail.hotel?.address}</p>
          <p><strong>Stars:</strong> {paymentDetail.hotel?.stars}</p>
          <p><strong>Check-in:</strong> {paymentDetail.check_in}</p>
          <p><strong>Check-out:</strong> {paymentDetail.check_out}</p>
          <p><strong>Days:</strong> {paymentDetail.days}</p>
          <p>
            <strong>Status:</strong> 
            <span className={`badge ${paymentDetail.status === 'Confirmed' ? 'bg-success' : 'bg-warning'} ms-2`}>
              {paymentDetail.status}
            </span>
          </p>
          <p><strong>Total Price:</strong> <span className="text-primary">{paymentDetail.total_price} EGP</span></p>
        </div>

        <div className="card-footer">
          <h5 className="mt-3">Rooms Booked:</h5>
          {paymentDetail.items && paymentDetail.items.length > 0 ? (
            paymentDetail.items.map((item) => (
              <div key={item.id} className="mb-3">
                <p><strong>Room Type:</strong> {item.room_type?.room_type}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
              </div>
            ))
          ) : (
            <p className="text-secondary">No rooms booked.</p>
          )}
        </div>
      </div>

      <div className="payment-section text-center mt-4">
        <button onClick={handlePayment} className="btn btn-primary booking-btn">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BookingDetail;
