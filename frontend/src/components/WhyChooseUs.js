import React from 'react';
import { motion } from 'framer-motion';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: 'fas fa-users',
      title: 'Experienced Drivers',
      description: 'Our professional drivers have years of experience and extensive knowledge of local routes.'
    },
    {
      icon: 'fas fa-car',
      title: 'Well-Maintained Fleet',
      description: 'Regular maintenance and modern vehicles ensure a comfortable and safe journey.'
    },
    {
      icon: 'fas fa-dollar-sign',
      title: 'Transparent Pricing',
      description: 'No hidden charges. What you see is what you pay with our upfront pricing policy.'
    },
    {
      icon: 'fas fa-headset',
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance to help you with bookings, queries, and emergencies.'
    },
    {
      icon: 'fas fa-map-marked-alt',
      title: 'GPS Tracking',
      description: 'Real-time tracking for your safety and to keep you informed about your ride.'
    },
    {
      icon: 'fas fa-medal',
      title: 'Quality Assurance',
      description: 'Consistent high-quality service with regular feedback collection and improvement.'
    }
  ];

  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="content-wrapper">
          <motion.div 
            className="content-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why Choose SK Victory Cab?</h2>
            <p className="section-description">
              With years of experience in the transportation industry, we have built our reputation 
              on reliability, safety, and customer satisfaction. Here's what sets us apart from the competition.
            </p>
            
            <div className="achievements">
              <div className="achievement-item">
                <div className="achievement-number">500+</div>
                <div className="achievement-label">Satisfied Customers</div>
              </div>
              <div className="achievement-item">
                <div className="achievement-number">10+</div>
                <div className="achievement-label">Years of Service</div>
              </div>
              <div className="achievement-item">
                <div className="achievement-number">99%</div>
                <div className="achievement-label">On-Time Rate</div>
              </div>
            </div>

            <div className="cta-buttons">
              <a href="tel:+919876543210" className="btn btn-primary">
                <i className="fas fa-phone"></i>
                Call Now
              </a>
              <a href="#contact" className="btn btn-outline">
                <i className="fas fa-envelope"></i>
                Get Quote
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="reasons-grid"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="reason-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="reason-icon">
                  <i className={reason.icon}></i>
                </div>
                <h3 className="reason-title">{reason.title}</h3>
                <p className="reason-description">{reason.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;