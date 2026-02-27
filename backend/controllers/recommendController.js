/**
 * AI Recommended Places – curated list (can be replaced with AI/ML later)
 */
const recommendations = [
  {
    id: '1',
    name: 'Taj Mahal',
    image: null,
    bestTime: 'Sunrise or sunset',
    reason: 'Fewer crowds and magical light for photos. Avoid midday heat.',
  },
  {
    id: '2',
    name: 'Gateway of India',
    image: null,
    bestTime: 'Evening',
    reason: 'Beautiful at dusk with the harbour lights. Great for a stroll.',
  },
  {
    id: '3',
    name: 'Jaipur City Palace',
    image: null,
    bestTime: 'Morning (9–11 AM)',
    reason: 'Cooler and less crowded. Allow 2–3 hours to explore.',
  },
  {
    id: '4',
    name: 'Kerala Backwaters',
    image: null,
    bestTime: 'Oct–Mar',
    reason: 'Pleasant weather. Houseboat stays are unforgettable.',
  },
  {
    id: '5',
    name: 'Rishikesh',
    image: null,
    bestTime: 'Feb–May, Sep–Nov',
    reason: 'Ideal for yoga and adventure. Ganga Aarti at sunset.',
  },
];

exports.getRecommendations = async (req, res) => {
  try {
    res.json(recommendations);
  } catch (err) {
    console.error('Recommend error:', err);
    res.status(500).json({ error: 'Failed to load recommendations' });
  }
};
