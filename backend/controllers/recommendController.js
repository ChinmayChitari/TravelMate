const Tour = require('../models/Tour');

const allPlaces = [
  {
    id: '1',
    name: 'Taj Mahal',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    bestTime: 'Sunrise or sunset',
    description: 'An immense mausoleum of white marble, built in Agra. Magical light for photos.',
    history: 'Built by Shah Jahan in memory of Mumtaz Mahal.',
    latitude: 27.1751,
    longitude: 78.0421,
    type: 'monument',
    openHour: 6,
    closeHour: 18
  },
  {
    id: '2',
    name: 'Gateway of India',
    image: 'https://images.unsplash.com/photo-1588714030617-640b3cb15bf6',
    bestTime: 'Evening',
    description: 'Beautiful at dusk with the harbour lights. Great for a stroll.',
    history: 'Built during British rule to welcome King George V and Queen Mary.',
    latitude: 18.9220,
    longitude: 72.8347,
    type: 'monument',
    openHour: 0,
    closeHour: 24
  },
  {
    id: '3',
    name: 'Jaipur City Palace',
    image: 'https://images.unsplash.com/photo-1599661559858-522eb1f8dc9c',
    bestTime: 'Morning (9–11 AM)',
    description: 'A beautiful palace complex. Cooler and less crowded in mornings.',
    history: 'Constructed by Jai Singh II between 1729 and 1732.',
    latitude: 26.9255,
    longitude: 75.8236,
    type: 'monument',
    openHour: 9,
    closeHour: 17
  },
  {
    id: '4',
    name: 'Kerala Backwaters',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0fb99c',
    bestTime: 'Oct–Mar',
    description: 'Pleasant weather. Houseboat stays are unforgettable.',
    history: 'Known as the Venice of the East, famed for its network of canals.',
    latitude: 9.4981,
    longitude: 76.3388,
    type: 'nature',
    openHour: 0,
    closeHour: 24
  },
  {
    id: '5',
    name: 'Rishikesh',
    image: 'https://images.unsplash.com/photo-1610465299993-e6675c9f9fac',
    bestTime: 'Feb–May, Sep–Nov',
    description: 'Ideal for yoga and adventure. Ganga Aarti at sunset.',
    history: 'Known as the Yoga Capital of the World along the sacred Ganges.',
    latitude: 30.0869,
    longitude: 78.2676,
    type: 'temple',
    openHour: 5,
    closeHour: 21
  },
  {
    id: '6',
    name: 'Meenakshi Temple',
    image: 'https://images.unsplash.com/photo-1596401057633-54a1feeee1c9',
    bestTime: 'Early Morning',
    description: 'Historic Hindu temple famous for its towering gopurams.',
    history: 'Dedicated to Goddess Meenakshi, built primarily in the 17th century.',
    latitude: 9.9195,
    longitude: 78.1193,
    type: 'temple',
    openHour: 5,
    closeHour: 22
  }
];

exports.getRecommendations = async (req, res) => {
  try {
    const userTours = await Tour.find({ userId: req.user.id }).lean();
    
    // Determine user preferences
    const categoryCounts = {};
    userTours.forEach(tour => {
      const pName = tour.placeName.toLowerCase();
      if (pName.includes('temple') || pName.includes('shrine')) categoryCounts['temple'] = (categoryCounts['temple'] || 0) + 1;
      else if (pName.includes('park') || pName.includes('water') || pName.includes('beach')) categoryCounts['nature'] = (categoryCounts['nature'] || 0) + 1;
      else categoryCounts['monument'] = (categoryCounts['monument'] || 0) + 1; // Default
    });

    let topCategory = 'monument';
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    }

    const currentHour = new Date().getHours();

    // Map through places, decide reasons and open status
    let dynamicRecommendations = allPlaces.map(place => {
      let reason = '';
      if (maxCount > 0 && place.type === topCategory) {
        reason = `Recommended because you explore a lot of ${place.type}s.`;
      } else {
        reason = `Popular destination for travelers globally.`;
      }

      const isOpen = (currentHour >= place.openHour && currentHour < place.closeHour) || (place.openHour === 0 && place.closeHour === 24);

      return {
        ...place,
        reason,
        isOpen
      };
    });

    // Sort: places of the preferred category first, then by whether they are open right now
    dynamicRecommendations.sort((a, b) => {
      if (a.type === topCategory && b.type !== topCategory) return -1;
      if (b.type === topCategory && a.type !== topCategory) return 1;
      if (a.isOpen && !b.isOpen) return -1;
      if (!a.isOpen && b.isOpen) return 1;
      return 0;
    });

    res.json(dynamicRecommendations.slice(0, 5));
  } catch (err) {
    console.error('Recommend error:', err);
    res.status(500).json({ error: 'Failed to load recommendations' });
  }
};
