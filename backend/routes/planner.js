const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');

router.post('/', plannerController.planTrip);

module.exports = router;
