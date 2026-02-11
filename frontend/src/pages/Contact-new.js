import React from 'react';

const Contact = () => {
  return (
    <div style={{ padding: '100px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>Contact Us</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '15px' }}>📞 Call Us</h3>
            <p><a href="tel:+919876543210" style={{ color: '#667eea', textDecoration: 'none' }}>+91 98765 43210</a></p>
            <p style={{ color: '#64748b' }}>Available 24/7</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '15px' }}>📧 Email Us</h3>
            <p><a href="mailto:info@skvictorycab.com" style={{ color: '#667eea', textDecoration: 'none' }}>info@skvictorycab.com</a></p>
            <p style={{ color: '#64748b' }}>Response within 2 hours</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '15px' }}>📍 Location</h3>
            <p style={{ color: '#64748b' }}>123 Main Street<br/>City, State 12345</p>
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '30px' }}>Send us a Message</h2>
          <form>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <input type="text" placeholder="First Name" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '5px' }} />
              <input type="text" placeholder="Last Name" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '5px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <input type="email" placeholder="Email" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '5px' }} />
              <input type="tel" placeholder="Phone" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '5px' }} />
            </div>
            <textarea placeholder="Your Message" rows="5" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '5px', marginBottom: '20px', resize: 'vertical' }}></textarea>
            <button type="submit" style={{ background: '#667eea', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>Send Message</button>
          </form>
        </div>
        
        <div style={{ marginTop: '50px', padding: '30px', background: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px' }}>Frequently Asked Questions</h3>
          
          <div style={{ display: 'grid', gap: '20px', textAlign: 'left' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>How far in advance should I book?</h4>
              <p style={{ color: '#64748b', margin: 0 }}>We recommend booking at least 24 hours in advance for regular trips and 48-72 hours for outstation journeys.</p>
            </div>
            
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>Do you provide child seats?</h4>
              <p style={{ color: '#64748b', margin: 0 }}>Yes, we provide child seats on request at no extra charge. Please mention this when booking.</p>
            </div>
            
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>What are your payment options?</h4>
              <p style={{ color: '#64748b', margin: 0 }}>We accept cash, UPI, credit/debit cards, and digital wallets. Corporate billing available.</p>
            </div>
            
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>Do you operate 24/7?</h4>
              <p style={{ color: '#64748b', margin: 0 }}>Yes, we provide 24/7 service. Night charges may apply for trips between 11 PM and 6 AM.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;