const express = require('express');
const router = express.Router();

// Get all bookings
router.get('/', (req, res) => {
  res.json({ 
    message: 'Get all bookings',
    bookings: []
  });
});

// Get single booking
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Get booking ${id}`,
    booking: { id }
  });
});

// Create new booking
router.post('/', (req, res) => {
  const bookingData = req.body;
  res.status(201).json({ 
    message: 'Booking created successfully',
    booking: bookingData
  });
});

// Update booking
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const bookingData = req.body;
  res.json({ 
    message: `Booking ${id} updated successfully`,
    booking: { id, ...bookingData }
  });
});

// Delete booking
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Booking ${id} deleted successfully`
  });
});

module.exports = router;
