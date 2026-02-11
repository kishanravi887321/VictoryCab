import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1>Welcome to SK Victory Cab</h1>
      <p>Your trusted partner for reliable transportation and tourism services.</p>
      <div style={{ margin: '40px 0' }}>
        <a href="tel:+919876543210" style={{ background: '#667eea', color: 'white', padding: '12px 24px', borderRadius: '25px', textDecoration: 'none' }}>
          Book Now
        </a>
      </div>
    </div>
  );
};

export default HomePage;