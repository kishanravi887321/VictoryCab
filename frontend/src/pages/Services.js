import React from 'react';
import { motion } from 'framer-motion';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 'airport-transfer',
      icon: 'fas fa-plane-departure',
      title: 'Airport Transfer',
      description: 'Reliable and punctual airport pickup and drop services with flight tracking and meet & greet assistance.',
      features: [
        'Flight tracking for delayed arrivals',
        'Meet and greet at arrival gate',
        'Luggage assistance included',
        'Child seats available on request',
        'SMS and email confirmations'
      ],
      pricing: 'Starting from ₹800',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&h=250&fit=crop'
    },
    {
      id: 'city-tours',
      icon: 'fas fa-city',
      title: 'City Tours',
      description: 'Explore the city with our experienced local guides who know all the hidden gems and popular attractions.',
      features: [
        'Experienced local drivers/guides',
        'Flexible itinerary planning',
        'Photography assistance',
        'Multiple language support',
        'Complimentary bottled water'
      ],
      pricing: 'Starting from ₹1200/day',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop'
    },
    {
      id: 'corporate-travel',
      icon: 'fas fa-briefcase',
      title: 'Corporate Travel',
      description: 'Professional transportation solutions for business meetings, conferences, and corporate events.',
      features: [
        'Professional uniformed drivers',
        'Premium vehicle fleet',
        'Corporate billing available',
        'Multi-city trip planning',
        'Executive assistance services'
      ],
      pricing: 'Custom packages available',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop'
    },
    {
      id: 'wedding-transport',
      icon: 'fas fa-heart',
      title: 'Wedding Transport',
      description: 'Make your special day memorable with our luxury wedding transportation and decorative vehicle services.',
      features: [
        'Luxury and vintage car options',
        'Vehicle decoration services',
        'Bridal party transportation',
        'Photography coordination',
        'Special wedding packages'
      ],
      pricing: 'Starting from ₹5000',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=250&fit=crop'
    },
    {
      id: 'outstation-trips',
      icon: 'fas fa-route',
      title: 'Outstation Trips',
      description: 'Comfortable long-distance travel with experienced drivers, multiple stops, and overnight trip options.',
      features: [
        'Long-distance specialists',
        'Multiple destination stops',
        'Overnight trip arrangements',
        'Highway toll management',
        'Emergency roadside assistance'
      ],
      pricing: 'Starting from ₹10/km',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=250&fit=crop'
    },
    {
      id: 'hourly-rental',
      icon: 'fas fa-clock',
      title: 'Hourly Rental',
      description: 'Flexible car rental service for multiple hours with unlimited stops within the city limits.',
      features: [
        'Minimum 4-hour booking',
        'Unlimited stops within city',
        'Wait and return service',
        'Flexible pickup locations',
        'Driver refreshment included'
      ],
      pricing: 'Starting from ₹200/hour',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop'
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-background"></div>
        <div className="container">
          <motion.div 
            className="services-hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Our Premium Services</h1>
            <p>Comprehensive transportation solutions tailored to meet all your travel needs with comfort, safety, and reliability.</p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="service-detailed-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                  <div className="service-icon-overlay">
                    <i className={service.icon}></i>
                  </div>
                </div>
                
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <ul className="service-features">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <i className="fas fa-check-circle"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="service-footer">
                    <div className="service-pricing">{service.pricing}</div>
                    <button className="service-book-btn">
                      <i className="fas fa-phone"></i>
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Need a Custom Solution?</h2>
            <p>We understand that every customer has unique requirements. Contact us to discuss your specific transportation needs and get a personalized quote.</p>
            <div className="cta-buttons">
              <a href="tel:+919876543210" className="btn btn-primary">
                <i className="fas fa-phone"></i>
                Call Now
              </a>
              <a href="#contact" className="btn btn-outline">
                <i className="fas fa-envelope"></i>
                Get Custom Quote
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;