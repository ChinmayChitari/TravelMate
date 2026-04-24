const claudeService = require('../services/claudeService');

exports.planTrip = async (req, res, next) => {
  try {
    const { destination, days, budget, currency, style, interests, travelers, language } = req.body;

    if (!destination || !days) {
      return res.status(400).json({ error: 'Destination and days are required' });
    }

    const systemPrompt = `Create a detailed ${days}-day trip plan for ${destination} for ${travelers} travelers with a total budget of ${budget} ${currency}. Travel style: ${style}. Interests: ${interests.join(', ')}. Respond ONLY in valid JSON:
    { "itinerary": [ { "day": 1, "date": "Day 1", "activities": [ { "time": "10:00 AM", "name": "...", "description": "...", "cost": 0, "category": "...", "icon": "..." } ] } ], "budgetBreakdown": { "accommodation": 0, "food": 0, "transport": 0, "activities": 0 }, "tips": ["..."], "bestSeason": "...", "emergencyContacts": ["..."] }
    Respond in ${language || 'English'}. Return ONLY the raw JSON string without any markdown formatting.`;

    const response = await claudeService.sendMessage({
      model: 'anthropic/claude-3-haiku',
      max_tokens: 4000,
      system: "You are a professional JSON generator.",
      response_format: { type: "json_object" },
      messages: [
        { role: 'user', content: systemPrompt }
      ]
    });

    const replyText = response.content[0].text;
    
    const jsonMatch = replyText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response");
    }

    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (error) {
    console.error('Planner error:', error.message);
    res.status(500).json({ error: 'Connection failed. Please try again.' });
  }
};
