const express = require('express');
const router = express.Router();

// Dummy in-memory booking storage (for now)
let bookings = [];

// GET route
router.get('/', (req, res) => {
  res.send('📅 Booking route is working!');
});

// POST route
router.post('/', (req, res) => {
  const { name, phone, date, session } = req.body;

  if (!name || !phone || !date || !session) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newBooking = {
    id: bookings.length + 1,
    name,
    phone,
    date,
    session
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

module.exports = router;
