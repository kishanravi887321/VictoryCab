const express = require('express');
const router = express.Router();

// Get all drivers
router.get('/', (req, res) => {
  res.json({ 
    message: 'Get all drivers',
    drivers: []
  });
});

// Get single driver
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Get driver ${id}`,
    driver: { id }
  });
});

// Create new driver
router.post('/', (req, res) => {
  const driverData = req.body;
  res.status(201).json({ 
    message: 'Driver created successfully',
    driver: driverData
  });
});

module.exports = router;
