import React from 'react';
import { motion } from 'framer-motion';
import './ServiceHighlights.css';

const ServiceHighlights = () => {
  const services = [
    {
      icon: 'fas fa-plane-departure',
      title: 'Airport Transfer',
      description: 'Reliable pickup and drop services to and from airports with flight tracking.',
      features: ['Flight Tracking', 'Meet & Greet', 'Luggage Assistance']
    },
    {
      icon: 'fas fa-city',
      title: 'City Tours',
      description: 'Explore the city with our experienced drivers who know all the best spots.',
      features: ['Local Guide', 'Flexible Routes', 'Photo Stops']
    },
    {
      icon: 'fas fa-briefcase',
      title: 'Corporate Travel',
      description: 'Professional transportation solutions for business meetings and events.',
      features: ['Professional Drivers', 'Premium Vehicles', 'Flexible Billing']
    },
    {
      icon: 'fas fa-heart',
      title: 'Wedding Transport',
      description: 'Make your special day memorable with our luxury wedding transportation.',
      features: ['Luxury Cars', 'Decorated Vehicles', 'Special Packages']
    },
    {
      icon: 'fas fa-route',
      title: 'Outstation Trips',
      description: 'Comfortable long-distance travel with experienced drivers and rest stops.',
      features: ['Long Distance', 'Multiple Stops', 'Overnight Trips']
    },
    {
      icon: 'fas fa-clock',
      title: 'Hourly Rental',
      description: 'Rent a cab for multiple hours with flexible pickup and drop locations.',
      features: ['Flexible Hours', 'Multiple Stops', 'Wait & Return']
    }
  ];

  return (
    <section id="services" className="service-highlights">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Our Premium Services</h2>
          <p>Discover our comprehensive range of transportation solutions designed to meet all your travel needs</p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="service-btn">
                Book Now
                <i className="fas fa-arrow-right"></i>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;