const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

// POST create new event (for admin)
router.post('/', async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).json(event);
});

module.exports = router;
