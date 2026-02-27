const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const optionalAuth = require('../middleware/optionalAuth');

router.post('/analyze', optionalAuth, imageController.analyzeImage);

module.exports = router;
