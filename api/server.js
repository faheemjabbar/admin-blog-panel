require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // local path from server.js
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const calendarRoutes = require('./routes/calendar');

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/calendar', calendarRoutes);

// Start server (Render will set process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
