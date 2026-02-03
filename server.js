const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to VictoryCab API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Sample bookings endpoint
app.get('/api/bookings', (req, res) => {
  res.json({ 
    message: 'Bookings endpoint',
    bookings: []
  });
});

// Create booking endpoint
app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;
  res.status(201).json({ 
    message: 'Booking created successfully',
    booking: bookingData
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`VictoryCab Backend Server is running on port ${PORT}`);
});
