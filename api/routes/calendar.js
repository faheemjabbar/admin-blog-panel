// routes/calendar.js
const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/calendar
// @desc    Get all calendar events for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ user: req.userId }).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/calendar
// @desc    Add a new calendar event for the authenticated user
router.post('/', authMiddleware, async (req, res) => {
  const { name, date } = req.body;
  const newEvent = new CalendarEvent({
    name,
    date,
    user: req.userId,
  });

  try {
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
