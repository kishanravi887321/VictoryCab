import React from 'react';
import { motion } from 'framer-motion';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Excellent service! The driver was punctual, professional, and the vehicle was spotless. Will definitely use SK Victory Cab for all my future travels.'
    },
    {
      name: 'Michael Chen',
      role: 'Tourist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'They provided an amazing city tour experience. The driver knew all the best spots and gave great recommendations. Highly recommended for tourists!'
    },
    {
      name: 'Priya Sharma',
      role: 'Local Resident',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Safe, reliable, and affordable. I use their services regularly for airport transfers and have never been disappointed. Great customer service!'
    },
    {
      name: 'David Wilson',
      role: 'Corporate Client',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Perfect for business meetings. Always on time, professional drivers, and comfortable vehicles. SK Victory Cab has become our go-to transportation partner.'
    },
    {
      name: 'Emma Thompson',
      role: 'Wedding Coordinator',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'They handled our wedding transportation flawlessly. Beautiful decorated cars and exceptional service made our special day even more memorable.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Frequent Traveler',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Outstanding service for long-distance trips. The driver was courteous, the car was comfortable, and the journey was smooth and enjoyable.'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'filled' : ''}`}
      ></i>
    ));
  };

  return (
    <section className="testimonials">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>What Our Customers Say</h2>
          <p>Don't just take our word for it. Here's what our valued customers have to say about their experience with SK Victory Cab.</p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="rating">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="testimonials-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3>Ready to Experience Excellence?</h3>
          <p>Join hundreds of satisfied customers who trust SK Victory Cab for their transportation needs.</p>
          <a href="tel:+919876543210" className="btn btn-primary">
            <i className="fas fa-phone"></i>
            Book Your Ride Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;