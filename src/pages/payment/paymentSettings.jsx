import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentSettings } from '../../store/slices/payments';

const PaymentSettings = () => {
  const dispatch = useDispatch();
  const { paymentSettings, loading, error } = useSelector((state) => state.payments);

  const [settings, setSettings] = useState(paymentSettings);

  useEffect(() => {
    dispatch(fetchPaymentSettings());
  }, [dispatch]);

  useEffect(() => {
    setSettings(paymentSettings);
  }, [paymentSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch action to update payment settings here
  };

  return (
    <div className="container">
      <h1 className="my-4">Payment Settings</h1>
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Loading payment settings...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}
      {settings && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="deposit_percentage" className="form-label">
              Deposit Percentage
            </label>
            <input
              type="number"
              className="form-control"
              id="deposit_percentage"
              name="deposit_percentage"
              value={settings.deposit_percentage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="allow_card_payment" className="form-label">
              Allow Credit Card Payment
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              id="allow_card_payment"
              name="allow_card_payment"
              checked={settings.allow_card_payment}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentSettings;
