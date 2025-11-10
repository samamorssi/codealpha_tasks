const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  location: String,
  maxParticipants: Number
});

module.exports = mongoose.model('Event', eventSchema);
