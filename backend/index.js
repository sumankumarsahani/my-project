
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Import and use routes
const authRoutes = require('./routes/auth');
const scholarshipRoutes = require('./routes/scholarship');
const applicationRoutes = require('./routes/application');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/applications', applicationRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Routes
app.get('/', (req, res) => {
  res.send('Scholarship Management System API');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
