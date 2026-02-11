import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
      color: 'white', 
      padding: '60px 20px 20px',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '24px' }}>🚗</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' }}>SK Victory Cab</span>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
              Your trusted partner for reliable taxi services and memorable tourism experiences.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="#" style={{ color: '#60a5fa', fontSize: '20px' }}>📘</a>
              <a href="#" style={{ color: '#60a5fa', fontSize: '20px' }}>🐦</a>
              <a href="#" style={{ color: '#60a5fa', fontSize: '20px' }}>📸</a>
              <a href="#" style={{ color: '#60a5fa', fontSize: '20px' }}>💼</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}><a href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</a></li>
              <li style={{ marginBottom: '10px' }}><a href="/services" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Services</a></li>
              <li style={{ marginBottom: '10px' }}><a href="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>About Us</a></li>
              <li style={{ marginBottom: '10px' }}><a href="/contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: '20px' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}><span style={{ color: '#cbd5e1' }}>Airport Transfer</span></li>
              <li style={{ marginBottom: '10px' }}><span style={{ color: '#cbd5e1' }}>City Tours</span></li>
              <li style={{ marginBottom: '10px' }}><span style={{ color: '#cbd5e1' }}>Wedding Transport</span></li>
              <li style={{ marginBottom: '10px' }}><span style={{ color: '#cbd5e1' }}>Corporate Travel</span></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: '20px' }}>Contact Info</h4>
            <div style={{ color: '#cbd5e1' }}>
              <p style={{ marginBottom: '10px' }}>📞 +91 98765 43210</p>
              <p style={{ marginBottom: '10px' }}>📧 info@skvictorycab.com</p>
              <p style={{ marginBottom: '10px' }}>📍 123 Main Street, City, State</p>
              <p style={{ marginBottom: '10px' }}>🕒 24/7 Service Available</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(203, 213, 225, 0.2)', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            &copy; 2026 SK Saheb Alam Victory Cab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;