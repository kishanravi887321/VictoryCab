import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="container">
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Your Trusted Partner for
              <span className="text-gradient"> Premium Travel</span>
            </h1>
            <p className="hero-description">
              Experience comfortable and reliable taxi services with SK Victory Cab. 
              From airport transfers to city tours, we ensure your journey is safe, 
              convenient and memorable.
            </p>
            <div className="hero-actions">
              <a href="tel:+919876543210" className="btn btn-primary">
                <i className="fas fa-phone"></i>
                Book Now
              </a>
              <a href="#services" className="btn btn-secondary">
                <i className="fas fa-info-circle"></i>
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="hero-features"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="feature-content">
                <h3>24/7 Service</h3>
                <p>Available round the clock for your convenience</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="feature-content">
                <h3>Safe & Secure</h3>
                <p>Licensed drivers and well-maintained vehicles</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tag"></i>
              </div>
              <div className="feature-content">
                <h3>Best Prices</h3>
                <p>Competitive rates with no hidden charges</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Destinations</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Service Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;