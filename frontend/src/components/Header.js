import React from 'react';

const Header = () => {
  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      background: 'white', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
      zIndex: 1000,
      padding: '15px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🚗</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>SK Victory Cab</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '30px' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500' }}>Home</a>
          <a href="/services" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500' }}>Services</a>
          <a href="/about" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500' }}>About</a>
          <a href="/contact" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500' }}>Contact</a>
        </nav>
        
        <a href="tel:+919876543210" style={{
          background: '#667eea', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '25px', 
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          📞 Book Now
        </a>
      </div>
    </header>
  );
};

export default Header;