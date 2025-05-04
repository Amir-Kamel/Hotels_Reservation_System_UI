import React from 'react';
import { Link } from 'react-router-dom';
const teamMembers = [
    { name: 'Naghoma', role: 'CEO & Founder' },
    { name: 'Nouran', role: 'Head of Operations' },
    { name: 'Sobhi', role: 'Customer Experience' },
    { name: 'Atyya', role: 'Partnership Manager' },
];
const AboutUs = () => {
  return (
    <div className="about-us-container" style={{ backgroundColor: '#F9F5F1', color: '#1A1A1A', padding: '2rem' }}>
      <div className="about-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#1A1A1A', fontSize: '2.5rem', marginBottom: '1rem' }}>About Us</h1>
        <div style={{ width: '80px', height: '4px', backgroundColor: '#CD9A5E', margin: '0 auto' }}></div>
      </div>

      <div className="about-content" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <section style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ color: '#CD9A5E', marginBottom: '1rem' }}>Our Story</h2>
            <p style={{ lineHeight: '1.8', color: '#1A1A1A' }}>
              Founded in 2015, our hotel reservation platform has been connecting travelers with their perfect accommodations for nearly a decade. What started as a small startup with a handful of partner hotels has grown into a comprehensive service featuring thousands of properties worldwide.
            </p>
            <p style={{ lineHeight: '1.8', color: '#1A1A1A', marginTop: '1rem' }}>
              Our mission is simple: make travel planning effortless while ensuring you find the perfect place to stay, whether it's a luxury resort, boutique hotel, or cozy bed and breakfast.
            </p>
          </div>
          <div style={{ flex: '1', backgroundColor: '#E8DFD5', padding: '2rem', borderRadius: '8px', minWidth: '300px' }}>
            <h3 style={{ color: '#B45F3A', marginBottom: '1rem' }}>Our Vision</h3>
            <p style={{ color: '#1A1A1A', lineHeight: '1.6' }}>
              We envision a world where finding and booking the perfect accommodation is seamless and stress-free, allowing travelers to focus on creating memorable experiences.
            </p>
          </div>
        </section>

        <section style={{ backgroundColor: '#1A1A1A', padding: '3rem', borderRadius: '8px', color: '#F9F5F1' }}>
          <h2 style={{ color: '#CD9A5E', marginBottom: '1.5rem', textAlign: 'center' }}>What Sets Us Apart</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <h3 style={{ color: '#CD9A5E', marginBottom: '1rem' }}>Curated Selection</h3>
              <p style={{ lineHeight: '1.6' }}>We personally vet each hotel in our collection to ensure quality and authenticity.</p>
            </div>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <h3 style={{ color: '#CD9A5E', marginBottom: '1rem' }}>Best Price Guarantee</h3>
              <p style={{ lineHeight: '1.6' }}>Find a lower price elsewhere? We'll match it and give you an additional discount.</p>
            </div>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <h3 style={{ color: '#CD9A5E', marginBottom: '1rem' }}>24/7 Support</h3>
              <p style={{ lineHeight: '1.6' }}>Our customer service team is available around the clock to assist with any queries.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ color: '#CD9A5E', marginBottom: '1.5rem' }}>Our Team</h2>
          <p style={{ lineHeight: '1.8', color: '#1A1A1A', marginBottom: '2rem' }}>
            Our diverse team of travel enthusiasts, hospitality experts, and tech innovators work together to bring you the best hotel booking experience possible. With backgrounds spanning five continents, we understand the unique needs of travelers from all walks of life.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {teamMembers.map((member, index) => (
            <div key={index} style={{ 
                textAlign: 'center', 
                width: '220px',
                backgroundColor: '#E8DFD5',
                padding: '1.5rem',
                borderRadius: '8px'
            }}>
            <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    backgroundColor: '#8A8A8A', 
                    borderRadius: '50%', 
                    margin: '0 auto 1rem'
            }}></div>
            <h3 style={{ color: '#1A1A1A', marginBottom: '0.5rem' }}>{member.name}</h3>
            <p style={{ color: '#B45F3A', fontWeight: 'bold' }}>{member.role}</p>
            </div>
        ))}
            </div>
        </section>

        <section style={{ textAlign: 'center', margin: '2rem 0' }}>
          <h2 style={{ color: '#CD9A5E', marginBottom: '1.5rem' }}>Ready to Find Your Perfect Stay?</h2>
          <Link to="/hotels" style={{ 
            backgroundColor: '#CD9A5E !important', 
            color: '#CD9A5E !important', 
            padding: '0.8rem 2rem', 
            border:'1px solid  #CD9A5E',
            borderRadius: '4px', 
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}>
            Explore Hotels
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;