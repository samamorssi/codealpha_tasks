const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send(' Event Registration API is running!');
});
app.listen(5000, () => console.log("Server running on port 5000"));




// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
