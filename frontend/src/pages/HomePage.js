import React from 'react';
import Hero from '../components/Hero';
import ServiceHighlights from '../components/ServiceHighlights';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <ServiceHighlights />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
};

export default HomePage;