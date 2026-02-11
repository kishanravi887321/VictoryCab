import React from 'react';

const About = () => {
  return (
    <div style={{ padding: '100px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '30px' }}>About SK Victory Cab</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#64748b', marginBottom: '40px' }}>
          Founded in 2014 by SK Saheb Alam, Victory Cab began as a small transportation service 
          with a simple mission: to provide reliable, safe, and affordable taxi services to our community.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginTop: '50px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }}>10+</h3>
            <p style={{ color: '#64748b' }}>Years of Service</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }}>500+</h3>
            <p style={{ color: '#64748b' }}>Happy Customers</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }}>25+</h3>
            <p style={{ color: '#64748b' }}>Professional Drivers</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }}>99%</h3>
            <p style={{ color: '#64748b' }}>Customer Satisfaction</p>
          </div>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '40px', borderRadius: '10px', marginTop: '50px' }}>
          <h2 style={{ marginBottom: '20px' }}>Our Mission</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#64748b' }}>
            To provide exceptional transportation services that prioritize safety, comfort, and 
            reliability while building lasting relationships with our customers through trust and excellence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
