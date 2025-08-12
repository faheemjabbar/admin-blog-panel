// api/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db'); // Adjust path
const authRoutes = require('../routes/auth'); // Adjust path
const postRoutes = require('../routes/posts'); // Adjust path
const calendarRoutes = require('../routes/calendar'); // Adjust path

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

// Vercel handles the server listening, so we export the app
module.exports = app;