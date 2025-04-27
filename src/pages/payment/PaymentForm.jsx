import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPayment } from '../../store/slices/payments';

const CreatePayment = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.payments);

  const [paymentData, setPaymentData] = useState({
    reservation_id: '',
    payment_method: '',
    is_deposit: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPayment(paymentData));
  };

  return (
    <div className="container">
      <h1 className="my-4">Create Payment</h1>
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Processing payment...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reservation_id" className="form-label">
            Reservation ID
          </label>
          <input
            type="text"
            className="form-control"
            id="reservation_id"
            name="reservation_id"
            value={paymentData.reservation_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="payment_method" className="form-label">
            Payment Method
          </label>
          <select
            className="form-select"
            id="payment_method"
            name="payment_method"
            value={paymentData.payment_method}
            onChange={handleChange}
            required
          >
            <option value="">Select Method</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="is_deposit"
            name="is_deposit"
            checked={paymentData.is_deposit}
            onChange={(e) => setPaymentData((prevData) => ({ ...prevData, is_deposit: e.target.checked }))}
          />
          <label className="form-check-label" htmlFor="is_deposit">
            Is Deposit?
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Payment
        </button>
      </form>
    </div>
  );
};

export default CreatePayment;
