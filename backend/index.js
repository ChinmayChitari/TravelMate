const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const chatRoutes = require('./routes/chat');
const imageRoutes = require('./routes/image');
const authRoutes = require('./routes/auth');
const tourRoutes = require('./routes/tours');
const speechRoutes = require('./routes/speech');
const tripRoutes = require('./routes/trip');

app.use('/chat', chatRoutes);
app.use('/image', imageRoutes);
app.use('/auth', authRoutes);
app.use('/tours', tourRoutes);
app.use('/speech', speechRoutes);
app.use('/trip', tripRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
