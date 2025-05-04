import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaFacebookF, FaTwitter, FaGoogle, FaInstagram,
  FaLinkedinIn, FaGithub, FaHome, FaEnvelope, FaPhone, FaPrint
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-white mt-auto w-100">
     <div style={{ backgroundColor: '#CD9A5E' }} className="text-white py-3 w-100">
        <div className="container d-flex justify-content-between align-items-center">
            <span>Connect with us on social media:</span>
            <div>
            <a href="#" className="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="#" className="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" className="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer"><FaGoogle /></a>
            <a href="#" className="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="#" className="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="#" className="text-white footer-link" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            </div>
        </div>
    </div>

      <div style={{ backgroundColor: '#E8DFD5', color: '#1A1A1A' }} className="pt-5 pb-3 w-100">
        <Container>
          <Row>
            <Col md={3}>
              <h6 className="text-uppercase fw-bold mb-4 link-opacity-50-hover">HOTELIFY</h6>
              <p>Book your next stay at luxurious hotels around the world. Easy reservations, exclusive offers, and 24/7 support.</p>
            </Col>
            <Col md={3}>
                <h6 className="text-uppercase fw-bold mb-4">TOP HOTELS</h6>
                <ul className="list-unstyled">
                    <li className="mb-2"><a href="#" className="text-dark text-decoration-none footer-link">The Sunset Resort</a></li>
                    <li className="mb-2"><a href="#" className="text-dark text-decoration-none footer-link">Oceanic Paradise</a></li>
                    <li className="mb-2"><a href="#" className="text-dark text-decoration-none footer-link">Royal Grand Hotel</a></li>
                    <li className="mb-2"><a href="#" className="text-dark text-decoration-none footer-link">Mountain View Inn</a></li>
                </ul>
                </Col>

            <Col md={3}>
              <h6 className="text-uppercase fw-bold mb-4">USEFUL LINKS</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-dark text-decoration-none footer-link">About Us</a></li>
                <li className="mb-2"><a href="#" className="text-dark text-decoration-none footer-link">Booking Policy</a></li>
                <li className="mb-2"><a href="#" className="text-dark text-decoration-none footer-link">Contact Support</a></li>
                <li className="mb-2"><a href="#" className="text-dark text-decoration-none footer-link">Terms & Conditions</a></li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="text-uppercase fw-bold mb-4">CONTACT</h6>
              <p className="mb-2"><FaHome className="me-2" /> Cairo, Egypt</p>
              <p className="mb-2"><FaEnvelope className="me-2" /> support@hotelify.com</p>
              <p className="mb-2"><FaPhone className="me-2" /> +20 100 234 5678</p>
              <p className="mb-2"><FaPrint className="me-2" /> +20 100 234 5679</p>
            </Col>
          </Row>
        </Container>
      </div>

      <div style={{ backgroundColor: '#8A8A8A' }} className="text-center p-3 w-100 text-white">
        © {new Date().getFullYear()} Hotelify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
