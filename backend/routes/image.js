const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../controllers/imageController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), imageController.identifyLandmark);

module.exports = router;
