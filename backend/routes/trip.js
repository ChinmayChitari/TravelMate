const express = require('express');
const router = express.Router();
const { generateTripPlan } = require('../controllers/tripController');
const protect = require('../middleware/auth');

// POST /trip/generate  (protected – must be signed in)
router.post('/generate', protect, generateTripPlan);

module.exports = router;
