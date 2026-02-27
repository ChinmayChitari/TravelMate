const express = require('express');
const router = express.Router();
const multer = require('multer');
const speechController = require('../controllers/speechController');

// Multer configured to save file to 'uploads/' directory temporarily
const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });

// Route to handle speech-to-text conversion
// Expects 'audio' field in multipart/form-data
router.post('/', upload.single('audio'), speechController.speechToText);

module.exports = router;
