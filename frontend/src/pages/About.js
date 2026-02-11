import React from 'react';

const About = () => {
  const milestones = [
    { year: '2014', event: 'Company Founded', description: 'Started with a vision to provide reliable transportation services' },
    { year: '2016', event: 'Fleet Expansion', description: 'Expanded our fleet to 20+ vehicles with various categories' },
    { year: '2018', event: 'Digital Platform', description: 'Launched our digital booking platform for better customer experience' },
    { year: '2020', event: 'Safety Protocols', description: 'Implemented enhanced safety and sanitization protocols' },
    { year: '2022', event: '500+ Customers', description: 'Reached milestone of serving 500+ satisfied customers' },
    { year: '2024', event: 'Premium Services', description: 'Introduced luxury vehicle options and premium services' }
  ];

  const team = [
    {
      name: 'SK Saheb Alam',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'With over 15 years in the transportation industry, Saheb founded the company with a vision to provide reliable and safe travel experiences.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Rajesh ensures smooth operations and maintains our high standards of service quality across all departments.'
    },
    {
      name: 'Priya Sharma',
      role: 'Customer Relations Head',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
      bio: 'Priya leads our customer service team and ensures every customer has an exceptional experience with us.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background"></div>
        <div className="container">
          <motion.div 
            className="about-hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About SK Victory Cab</h1>
            <p>Your trusted transportation partner committed to providing safe, reliable, and comfortable travel experiences for over a decade.</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="our-story">
        <div className="container">
          <div className="story-content">
            <motion.div 
              className="story-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Our Story</h2>
              <p>
                Founded in 2014 by SK Saheb Alam, Victory Cab began as a small transportation service 
                with a simple mission: to provide reliable, safe, and affordable taxi services to our community. 
                What started with just two vehicles has grown into a trusted name in the transportation industry.
              </p>
              <p>
                Over the years, we've expanded our services to include airport transfers, city tours, 
                corporate travel, and special event transportation. Our commitment to customer satisfaction 
                and safety has earned us the trust of hundreds of customers who rely on us for their 
                transportation needs.
              </p>
              <div className="story-stats">
                <div className="stat">
                  <h3>10+</h3>
                  <p>Years of Service</p>
                </div>
                <div className="stat">
                  <h3>500+</h3>
                  <p>Happy Customers</p>
                </div>
                <div className="stat">
                  <h3>25+</h3>
                  <p>Professional Drivers</p>
                </div>
                <div className="stat">
                  <h3>99%</h3>
                  <p>Customer Satisfaction</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="story-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop" alt="Our Journey" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <motion.div 
              className="mv-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mv-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide exceptional transportation services that prioritize safety, comfort, and 
                reliability while building lasting relationships with our customers through trust and excellence.
              </p>
            </motion.div>

            <motion.div 
              className="mv-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mv-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Our Vision</h3>
              <p>
                To become the leading transportation service provider in the region, recognized for our 
                commitment to innovation, customer satisfaction, and contribution to sustainable mobility.
              </p>
            </motion.div>

            <motion.div 
              className="mv-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="mv-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Our Values</h3>
              <p>
                Safety first, customer-centric approach, integrity in all dealings, continuous improvement, 
                and environmental responsibility guide everything we do.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Journey
          </motion.h2>
          <div className="timeline-container">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h4>{milestone.event}</h4>
                  <p>{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Meet Our Team</h2>
            <p>The dedicated professionals who make your journey safe and comfortable</p>
          </motion.div>

          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;