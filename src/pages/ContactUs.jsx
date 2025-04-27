import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const iconWrapperStyle = {
    width: '36px',
    height: '36px',
    backgroundColor: '#CD9A5E',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
  };
  
  const iconStyle = {
    fontSize: '18px',
  };

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-container" style={{ backgroundColor: '#F9F5F1', color: '#1A1A1A', padding: '2rem' }}>
      <div className="contact-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#1A1A1A', fontSize: '2.5rem', marginBottom: '1rem' }}>Contact Us</h1>
        <div style={{ width: '80px', height: '4px', backgroundColor: '#CD9A5E', margin: '0 auto' }}></div>
        <p style={{ color: '#8A8A8A', maxWidth: '600px', margin: '1rem auto', lineHeight: '1.6' }}>
          Have questions or feedback? We'd love to hear from you. Fill out the form below or reach out through one of our contact channels.
        </p>
      </div>

      <div className="contact-content" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div className="contact-form" style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ color: '#CD9A5E', marginBottom: '1.5rem' }}>Send us a Message</h2>
          
          {isSubmitted && (
            <div style={{ 
              backgroundColor: '#E8DFD5', 
              padding: '1rem', 
              borderRadius: '4px', 
              marginBottom: '1rem',
              borderLeft: '4px solid #CD9A5E'
            }}>
              <p style={{ color: '#1A1A1A' }}>Thank you for your message! We'll get back to you shortly.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: '#1A1A1A' }}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '1px solid #E8DFD5',
                  borderRadius: '4px',
                  backgroundColor: '#F9F5F1'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#1A1A1A' }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '1px solid #E8DFD5',
                  borderRadius: '4px',
                  backgroundColor: '#F9F5F1'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', color: '#1A1A1A' }}>Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '1px solid #E8DFD5',
                  borderRadius: '4px',
                  backgroundColor: '#F9F5F1'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: '#1A1A1A' }}>Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '1px solid #E8DFD5',
                  borderRadius: '4px',
                  backgroundColor: '#F9F5F1',
                  resize: 'vertical'
                }}
              ></textarea>
            </div>
            
            <button 
              type="submit"
              style={{ 
                backgroundColor: '#CD9A5E', 
                color: '#F9F5F1', 
                padding: '0.8rem 2rem', 
                borderRadius: '4px', 
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              Send Message
            </button>
          </form>
        </div>
        
        <div className="contact-info" style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ backgroundColor: '#1A1A1A', padding: '2rem', borderRadius: '8px', color: '#F9F5F1', height: '100%' }}>
            <h2 style={{ color: '#CD9A5E', marginBottom: '1.5rem' }}>Get in Touch</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#CD9A5E', marginBottom: '0.5rem' }}>Our Office</h3>
              <p style={{ lineHeight: '1.6' }}>
                123 Hotel Avenue<br />
                Suite 456<br />
                New York, NY 10001
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#CD9A5E', marginBottom: '0.5rem' }}>Customer Support</h3>
              <p style={{ lineHeight: '1.6' }}>
                Email: support@hotelreservation.com<br />
                Phone: (555) 123-4567<br />
                Hours: 24/7
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#CD9A5E', marginBottom: '0.5rem' }}>Business Inquiries</h3>
              <p style={{ lineHeight: '1.6' }}>
                Email: partnerships@hotelreservation.com<br />
                Phone: (555) 765-4321<br />
                Hours: Monday - Friday, 9am - 5pm EST
              </p>
            </div>
            
            <div>
                <h3 style={{ color: '#CD9A5E', marginBottom: '0.5rem' }}>Follow Us</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" style={iconWrapperStyle}>
                    <FaFacebookF style={iconStyle} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter" style={iconWrapperStyle}>
                    <FaTwitter style={iconStyle} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" style={iconWrapperStyle}>
                    <FaInstagram style={iconStyle} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={iconWrapperStyle}>
                    <FaLinkedinIn style={iconStyle} />
                    </a>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto' }}>
        <h2 style={{ color: '#CD9A5E', marginBottom: '1.5rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
        
        {[
          {
            q: "How do I cancel or modify my booking?",
            a: "You can cancel or modify your booking by logging into your account and navigating to the 'My Bookings' section. From there, select the booking you wish to change and follow the instructions."
          },
          {
            q: "Is my payment information secure?",
            a: "Absolutely. We use industry-standard encryption and security protocols to ensure your payment information is always protected."
          },
          {
            q: "Do you offer refunds for cancellations?",
            a: "Refund policies vary depending on the hotel and the type of booking you've made. The specific cancellation policy will be clearly stated before you complete your booking."
          },
          {
            q: "How can I become a hotel partner?",
            a: "If you'd like to list your hotel on our platform, please contact our partnerships team at partnerships@hotelreservation.com or fill out the form on this page."
          }
        ].map((faq, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: '1rem',
              padding: '1.5rem',
              backgroundColor: index % 2 === 0 ? '#E8DFD5' : '#F9F5F1',
              borderRadius: '8px',
              borderLeft: `4px solid ${index % 2 === 0 ? '#B45F3A' : '#CD9A5E'}`
            }}
          >
            <h3 style={{ color: '#1A1A1A', marginBottom: '0.5rem' }}>{faq.q}</h3>
            <p style={{ color: '#1A1A1A', lineHeight: '1.6' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUs;