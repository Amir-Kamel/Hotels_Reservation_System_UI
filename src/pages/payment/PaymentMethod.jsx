import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './PaymentStyles.css';
import { Card, Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { fetchPaymentDetail, submitPaymentMethod } from '../../store/slices/payments';

const PaymentMethod = () => {
  const { paymentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { paymentDetail, loading, error: reduxError, paymentSuccess } = useSelector(state => state.payments);
  
  // Get payment data from location state or Redux store
  const [paymentData, setPaymentData] = useState(location.state?.paymentData || null);
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState({
    credit_card: true,
    paypal: true,
    bank_transfer: true
  });

  // Load payment details if not already loaded
  useEffect(() => {
    if (!paymentData && paymentId) {
      dispatch(fetchPaymentDetail(paymentId));
    }
  }, [dispatch, paymentId, paymentData]);

  //  error handling for missing location state
  useEffect(() => {
    if (!location.state?.paymentData && paymentId) {
      console.log("Payment data not found in location state, fetching from API");
      dispatch(fetchPaymentDetail(paymentId));
    }
  }, [dispatch, paymentId, location.state]);

  // Update local state when payment details are fetched from Redux
  useEffect(() => {
    if (paymentDetail && !paymentData) {
      try {
        setPaymentData({
          payment_id: paymentId,
          amount_to_pay: paymentDetail.summary?.total_price || 0,
          is_deposit: location.state?.clientInfo?.payment_type === 'cash',
          booking_summary: {
            room_name: paymentDetail.items?.map(item => 
              `${item.room_type?.room_type || 'Room'} (x${item.quantity || 1})`
            ).join(', ') || 'Room',
            check_in: paymentDetail.check_in || 'N/A',
            check_out: paymentDetail.check_out || 'N/A',
            total_price: paymentDetail.summary?.total_price || 
                        paymentDetail.total_price || 0
          }
        });
      } catch (err) {
        console.error("Error setting payment data:", err);
        setError("Could not process payment details");
      }
    }
  }, [paymentDetail, paymentData, paymentId, location.state]);

  const handleMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    
    try {
      // Dispatch the payment method submission
      const result = await dispatch(submitPaymentMethod({
        payment_id: paymentId,
        payment_method: selectedMethod
      })).unwrap();
      
      // Show success for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err?.message || 'There was an error processing your payment.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !paymentData) {
    return <div className="text-center mt-5">Loading payment details...</div>;
  }

  // Calculate deposit amount if applicable
  const depositAmount = paymentData.is_deposit 
    ? (paymentData.booking_summary.total_price * 0.3).toFixed(2)
    : paymentData.booking_summary.total_price;

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Select Payment Method</h1>
      
      {paymentSuccess && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>Payment Successful!</Alert.Heading>
          <p>Transaction ID: {paymentSuccess.transaction_id || 'Processing'}</p>
          <p>Amount Paid: ${paymentSuccess.amount_paid || depositAmount}</p>
          {paymentData.is_deposit && (
            <p>Remaining Amount Due: ${(paymentData.booking_summary.total_price - depositAmount).toFixed(2)}</p>
          )}
          <p>Redirecting to your bookings...</p>
        </Alert>
      )}
      
      {(error || reduxError) && (
        <Alert variant="danger" className="mb-4">
          {typeof error === 'object' ? JSON.stringify(error) : error}
          {typeof reduxError === 'object' ? JSON.stringify(reduxError) : reduxError}
        </Alert>
      )}
      
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white">
              <h4>Payment Method</h4>
            </Card.Header>
            <Card.Body>
              {paymentData.is_deposit && (
                <Alert variant="info" className="mb-4">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  You have selected cash payment. A 30% deposit of ${depositAmount} is required to secure your booking.
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <div className="payment-methods mb-4">
                  {availablePaymentMethods.credit_card && (
                    <Card 
                      className={`mb-3 payment-method-card ${selectedMethod === 'credit_card' ? 'border-primary' : ''}`}
                      onClick={() => setSelectedMethod('credit_card')}
                      style={selectedMethod === 'credit_card' ? {borderColor: '#CD9A5E'} : {}}
                    >
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          id="payment-credit-card"
                          name="payment_method"
                          value="credit_card"
                          checked={selectedMethod === 'credit_card'}
                          onChange={handleMethodChange}
                          label={
                            <div className="d-flex align-items-center">
                              <div className="payment-icon me-3">
                                <i className="bi bi-credit-card fs-3" style={{color: '#CD9A5E'}}></i>
                              </div>
                              <div>
                                <strong>Credit Card</strong>
                                <div className="text-muted small">Pay securely with your credit card</div>
                              </div>
                            </div>
                          }
                        />
                      </Card.Body>
                    </Card>
                  )}
                  
                  {availablePaymentMethods.paypal && (
                    <Card 
                      className={`mb-3 payment-method-card ${selectedMethod === 'paypal' ? 'border-primary' : ''}`}
                      onClick={() => setSelectedMethod('paypal')}
                      style={selectedMethod === 'paypal' ? {borderColor: '#CD9A5E'} : {}}
                    >
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          id="payment-paypal"
                          name="payment_method"
                          value="paypal"
                          checked={selectedMethod === 'paypal'}
                          onChange={handleMethodChange}
                          label={
                            <div className="d-flex align-items-center">
                              <div className="payment-icon me-3">
                                <i className="bi bi-paypal fs-3" style={{color: '#CD9A5E'}}></i>
                              </div>
                              <div>
                                <strong>PayPal</strong>
                                <div className="text-muted small">Pay securely with your PayPal account</div>
                              </div>
                            </div>
                          }
                        />
                      </Card.Body>
                    </Card>
                  )}
                  
                  {availablePaymentMethods.bank_transfer && (
                    <Card 
                      className={`mb-3 payment-method-card ${selectedMethod === 'bank_transfer' ? 'border-primary' : ''}`}
                      onClick={() => setSelectedMethod('bank_transfer')}
                      style={selectedMethod === 'bank_transfer' ? {borderColor: '#CD9A5E'} : {}}
                    >
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          id="payment-bank-transfer"
                          name="payment_method"
                          value="bank_transfer"
                          checked={selectedMethod === 'bank_transfer'}
                          onChange={handleMethodChange}
                          label={
                            <div className="d-flex align-items-center">
                              <div className="payment-icon me-3">
                                <i className="bi bi-bank fs-3" style={{color: '#CD9A5E'}}></i>
                              </div>
                              <div>
                                <strong>Bank Transfer</strong>
                                <div className="text-muted small">Pay via bank transfer</div>
                              </div>
                            </div>
                          }
                        />
                      </Card.Body>
                    </Card>
                  )}
                </div>
                
                {selectedMethod === 'credit_card' && (
                  <div className="credit-card-form mb-4">
                    <h5 className="mb-3">Credit Card Details</h5>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Card Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiration Date</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="123"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Cardholder Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name as appears on card"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg" 
                  className="w-100"
                  disabled={processing}
                  style={{ backgroundColor: '#CD9A5E', borderColor: '#CD9A5E' }}
                >
                  {processing ? 'Processing...' : `Pay $${paymentData.is_deposit ? depositAmount : paymentData.booking_summary.total_price}`}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h4>Order Summary</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h5>{paymentData.booking_summary.room_name}</h5>
              </div>
              
              <div className="mb-3 border-bottom pb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Check-in:</span>
                  <span>{paymentData.booking_summary.check_in}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Check-out:</span>
                  <span>{paymentData.booking_summary.check_out}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Room Price:</span>
                  <span>${paymentData.booking_summary.total_price}</span>
                </div>
                
                {paymentData.is_deposit && (
                  <>
                    <div className="d-flex justify-content-between">
                      <span>Deposit (30%):</span>
                      <span>${depositAmount}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between">
                  <strong>Amount Due Now:</strong>
                  <strong>${paymentData.is_deposit ? depositAmount : paymentData.booking_summary.total_price}</strong>
                </div>
                {paymentData.is_deposit && (
                  <div className="text-muted small mt-2">
                    * Remaining balance of ${(paymentData.booking_summary.total_price - depositAmount).toFixed(2)} to be paid upon arrival.
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentMethod;
