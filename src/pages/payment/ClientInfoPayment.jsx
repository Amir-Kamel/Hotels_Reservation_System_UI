import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './PaymentStyles.css';
import { Card, Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { fetchPaymentDetail, submitClientInfo } from '../../store/slices/payments';

const ClientInfoPayment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paymentDetail, loading, error: paymentError } = useSelector(state => state.payments);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    payment_type: 'online'
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchPaymentDetail(bookingId))
        .unwrap()
        .catch(err => {
          console.error("Error fetching payment details:", err);
          setError("Failed to load booking details. Please try again.");
        });
    }
  }, [dispatch, bookingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const displayError = (err) => {
    if (!err) return null;
    
    if (typeof err === 'object') {
      // If it's an error object with a message property
      if (err.message) return err.message;
      // Otherwise stringify the object
      return JSON.stringify(err);
    }
    
    // If it's already a string
    return err;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(submitClientInfo({
        ...formData,
        booking_id: bookingId
      })).unwrap();
      
      // Make sure result contains payment_id before navigating
      if (result && result.payment_id) {
        navigate(`/payment-method/${result.payment_id}`, { 
          state: { 
            paymentData: result,
            clientInfo: formData
          }
        });
      } else {
        console.error("Payment ID is missing in the response");
        setError("Payment processing error: Missing payment ID");
      }
    } catch (err) {
      setError(typeof err === 'object' ? (err.message || JSON.stringify(err)) : err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Complete Your Order</h1>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white">
              <h4>Client Information</h4>
            </Card.Header>
            <Card.Body>
            {(error || paymentError) && (
              <Alert variant="danger">
                {displayError(error) || displayError(paymentError)}
              </Alert>
            )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 01234567890"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Region</Form.Label>
                      <Form.Control
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Type</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="Online Payment"
                          name="payment_type"
                          value="online"
                          checked={formData.payment_type === 'online'}
                          onChange={handleChange}
                          id="payment-online"
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="Cash Payment"
                          name="payment_type"
                          value="cash"
                          checked={formData.payment_type === 'cash'}
                          onChange={handleChange}
                          id="payment-cash"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="notes mt-3">
                  {formData.payment_type === 'cash' && (
                    <Alert variant="info">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      For cash payments, a 30% deposit is required to secure your booking.
                    </Alert>
                  )}
                </div>
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
              {paymentDetail ? (
                <>
                  <div className="mb-3">
                    <h5>{paymentDetail.hotel?.name || 'Hotel Name'}</h5>
                    <div className="text-muted">
                      {paymentDetail.hotel?.description || ''}
                    </div>
                  </div>
                  
                  <div className="mb-3 border-bottom pb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Check-in:</span>
                      <span>{paymentDetail.check_in || 'N/A'}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Check-out:</span>
                      <span>{paymentDetail.check_out || 'N/A'}</span>
                    </div>
                    <div className="mt-3 mb-2">
                      <span className="fw-bold">Items booked:</span>
                    </div>
                    
                    {/* Add a conditional check for paymentDetail.items */}
                    {paymentDetail.items && paymentDetail.items.length > 0 ? (
                      paymentDetail.items.map((item, index) => (
                        <div key={index} className="d-flex justify-content-between mb-1">
                          <span>{item.room_type?.room_type || 'Standard'} Room</span>
                          <span>x{item.quantity || 1}</span>
                        </div>
                      ))
                    ) : (
                      <div>No items found</div>
                    )}
                    <div className="d-flex justify-content-between mt-2">
                      <span>Days:</span>
                      <span>{paymentDetail.days || 0}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Price:</span>
                      <span>${paymentDetail.total_price || 0}</span>
                    </div>
                    
                    {formData.payment_type === 'cash' && (
                      <>
                        <div className="d-flex justify-content-between">
                          <span>Deposit (30%):</span>
                          <span>${((paymentDetail.total_price || 0) * 0.3).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="border-top pt-3 mt-3">
                    <div className="d-flex justify-content-between">
                      <strong>Total Amount:</strong>
                      <strong>
                        ${formData.payment_type === 'cash' 
                          ? ((paymentDetail.total_price || 0) * 0.3).toFixed(2) 
                          : paymentDetail.total_price || 0}
                      </strong>
                    </div>
                    {formData.payment_type === 'cash' && (
                      <div className="text-muted small mt-2">
                        * Remaining balance of ${((paymentDetail.total_price || 0) * 0.7).toFixed(2)} to be paid upon arrival.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>Loading booking details...</div>
              )}
            </Card.Body>
            <Card.Footer className="bg-white">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100"
                onClick={handleSubmit}
                style={{ backgroundColor: '#CD9A5E', borderColor: '#CD9A5E' }}
              >
                Proceed to Checkout
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientInfoPayment;