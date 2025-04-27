import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments } from '../../store/slices/payments';

const PaymentsList = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="my-4">Payments</h1>
      <div className="row">
        {payments.length > 0 ? (
          payments.map(payment => (
            <div key={payment.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Payment #{payment.id}</h5>
                  <p className="card-text">Amount: {payment.amount}</p>
                  <p className="card-text">Status: {payment.status}</p>
                  <button className="btn btn-primary">View Details</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              No payments available.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsList;
