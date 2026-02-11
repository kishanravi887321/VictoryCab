import React from 'react';

const Services = () => {
  const services = [
    {
      title: 'Airport Transfer',
      description: 'Reliable pickup and drop services to and from airports.',
      price: 'Starting from ₹800'
    },
    {
      title: 'City Tours',
      description: 'Explore the city with our experienced drivers.',
      price: 'Starting from ₹1200/day'
    },
    {
      title: 'Corporate Travel',
      description: 'Professional transportation for business needs.',
      price: 'Custom packages available'
    },
    {
      title: 'Wedding Transport',
      description: 'Luxury transportation for your special day.',
      price: 'Starting from ₹5000'
    }
  ];

  return (
    <div style={{ padding: '100px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>Our Services</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {services.map((service, index) => (
          <div key={index} style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>{service.title}</h3>
            <p style={{ color: '#64748b', marginBottom: '15px' }}>{service.description}</p>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>{service.price}</div>
            <button style={{ marginTop: '15px', background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
