const axios = require('axios');

/**
 * AI Trip Planner Controller
 * Generates a structured day-by-day itinerary with cost breakdowns.
 */
exports.generateTripPlan = async (req, res) => {
  const { destination, days, budget, currency = 'INR', language = 'English' } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: 'destination and days are required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // ── MOCK fallback when no API key ──────────────────────────────────────────
  if (!apiKey) {
    const mockPlan = Array.from({ length: Number(days) || 3 }, (_, i) => ({
      day: i + 1,
      theme: i === 0 ? 'Arrival & Local Exploration' : i === Number(days) - 1 ? 'Departure Day' : `Exploring ${destination}`,
      activities: [
        `Morning: Visit a famous local landmark in ${destination}`,
        'Afternoon: Enjoy local cuisine at a popular restaurant',
        'Evening: Stroll through the old town / night market',
      ],
      food: ['Breakfast at hotel', 'Local street food lunch', 'Traditional dinner'],
      tips: 'Carry water and a light jacket.',
      cost: {
        stay: Math.round((Number(budget) || 5000) / Number(days) * 0.4),
        food: Math.round((Number(budget) || 5000) / Number(days) * 0.3),
        travel: Math.round((Number(budget) || 5000) / Number(days) * 0.2),
        activities: Math.round((Number(budget) || 5000) / Number(days) * 0.1),
      },
    }));
    return res.json({ plan: mockPlan, destination, days, budget, currency, isMock: true });
  }

  // ── Real AI path ───────────────────────────────────────────────────────────
  const prompt = `
You are an expert travel planner. Plan a ${days}-day trip to ${destination} within a total budget of ${budget} ${currency}.
The response must be in ${language}.

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "plan": [
    {
      "day": 1,
      "theme": "Arrival & City Overview",
      "activities": ["Activity 1", "Activity 2", "Activity 3"],
      "food": ["Breakfast suggestion", "Lunch suggestion", "Dinner suggestion"],
      "tips": "A single practical travel tip for the day.",
      "cost": {
        "stay": 1200,
        "food": 600,
        "travel": 300,
        "activities": 200
      }
    }
  ]
}

Rules:
- Costs should be realistic for ${destination} in ${currency}.
- Total cost across ALL days should be <= ${budget} ${currency}.
- Each day must have exactly 3 activities and 3 food items.
- Tips should be short (1 sentence).
- No markdown code blocks, just raw JSON.
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const rawText = response.data.choices[0].message.content.trim();

    let parsed;
    try {
      // Strip any accidental markdown fences
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Graceful fallback: wrap raw text in a single-day plan
      parsed = {
        plan: [{ day: 1, theme: 'Day 1', activities: [rawText], food: [], tips: '', cost: { stay: 0, food: 0, travel: 0, activities: 0 } }],
      };
    }

    res.json({ ...parsed, destination, days, budget, currency });
  } catch (err) {
    console.error('Trip Planner Error:', err.message);
    res.status(500).json({ error: 'Failed to generate trip plan. Please try again.' });
  }
};
