const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const optionalAuth = require('../middleware/optionalAuth');

router.post('/', optionalAuth, chatController.chatGuide);

module.exports = router;
