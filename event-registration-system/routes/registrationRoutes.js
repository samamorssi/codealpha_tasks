const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// POST register user for event
router.post('/', async (req, res) => {
  const { userName, userEmail, eventId } = req.body;
  const registration = new Registration({ userName, userEmail, eventId });
  await registration.save();
  res.status(201).json(registration);
});

// GET user's registrations (by email)
router.get('/:userEmail', async (req, res) => {
  const registrations = await Registration.find({ userEmail: req.params.userEmail }).populate('eventId');
  res.json(registrations);
});

// DELETE cancel registration
router.delete('/:id', async (req, res) => {
  await Registration.findByIdAndDelete(req.params.id);
  res.json({ message: 'Registration canceled' });
});

module.exports = router;
