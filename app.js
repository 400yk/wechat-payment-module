const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Middleware setup
app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false })); // handle urlencoded data
app.use(express.json());
app.use(cookieParser()); // middleware for cookies
app.use(express.static(path.join(__dirname, 'client'))); // Serve static files from the client directory

// Serve the images directory
app.use('/imgs', express.static(path.join(__dirname, 'imgs')));

// Routes for the payment module
app.use('/payNotify', require('./routes/api/payNotify'));

// This middleware would authenticate users in a real application
app.use((req, res, next) => {
  // For demo purposes, set a dummy user
  req.user = 'testuser';
  next();
});

app.use('/order', require('./routes/api/order'));

// Simple home route - serve the HTML file from the client directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Do not start the server here - this is now handled by bin/www
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app; 