require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting setup (100 requests per hour)
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after an hour' }
});

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

// API route to safely provide Supabase config to frontend
app.get('/api/config', (req, res) => {
  res.json({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
  });
});

// Serve the static files from the root directory
app.use(express.static(path.join(__dirname, '.')));

// Fallback route to serve the main portfolio HTML for unknown routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'franklin_portfolio.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
