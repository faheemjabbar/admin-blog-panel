// api/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // FIXED PATH
const authRoutes = require('./routes/auth'); // FIXED PATH
const postRoutes = require('./routes/posts'); // FIXED PATH
const calendarRoutes = require('./routes/calendar'); // FIXED PATH

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/calendar', calendarRoutes);

// Export app (for serverless hosting)
module.exports = app;

// If running locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
