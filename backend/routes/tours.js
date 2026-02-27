const express = require('express');
const Tour = require('../models/Tour');
const auth = require('../middleware/auth');
const recommendController = require('../controllers/recommendController');

const router = express.Router();

router.get('/history', auth, async (req, res) => {
  try {
    const tours = await Tour.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(tours);
  } catch (err) {
    console.error('Tour history error:', err);
    res.status(500).json({ error: 'Failed to load tour history' });
  }
});

router.get('/recommend', auth, recommendController.getRecommendations);

router.post('/', auth, async (req, res) => {
  try {
    const { placeName, description } = req.body;
    if (!placeName || !description) {
      return res.status(400).json({ error: 'placeName and description required' });
    }
    const tour = await Tour.create({
      userId: req.user.id,
      placeName: String(placeName),
      description: String(description),
    });
    res.status(201).json(tour);
  } catch (err) {
    console.error('Save tour error:', err);
    res.status(500).json({ error: 'Failed to save tour' });
  }
});

module.exports = router;
