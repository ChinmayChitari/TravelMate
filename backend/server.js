const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load root if exists
require('dotenv').config({ path: path.resolve(__dirname, '.env') });    // Load backend/.env (takes precedence)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');
const chatRoutes = require('./routes/chat');
const imageRoutes = require('./routes/image');
const plannerRoutes = require('./routes/planner');
const placesRoutes = require('./routes/places');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/identify-landmark', imageRoutes);
app.use('/api/plan-trip', plannerRoutes);
app.use('/api/places', placesRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
