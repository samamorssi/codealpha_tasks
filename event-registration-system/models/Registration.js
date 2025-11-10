const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);
