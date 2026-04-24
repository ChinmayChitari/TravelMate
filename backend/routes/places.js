const express = require('express');
const router = express.Router();
const placesController = require('../controllers/placesController');

router.get('/recommendations', placesController.getRecommendations);

module.exports = router;
