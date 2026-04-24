const claudeService = require('../services/claudeService');

exports.getRecommendations = async (req, res, next) => {
  try {
    const systemPrompt = `You are an AI travel recommender. Provide a list of 6 amazing travel destinations.
    Respond ONLY in valid JSON with this exact structure:
    [
      { "name": "City, Country", "description": "Why visit...", "bestTime": "Morning/Sunset/Evening", "imageUrl": "unsplash_url_here" }
    ]`;

    const response = await claudeService.sendMessage({
      model: 'anthropic/claude-3-haiku',
      max_tokens: 1500,
      system: "You are a professional JSON generator.",
      response_format: { type: "json_object" },
      messages: [
        { role: 'user', content: systemPrompt }
      ]
    });

    const replyText = response.content[0].text;
    const jsonMatch = replyText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response");
    }

    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (error) {
    console.error('Places error:', error.message);
    res.status(500).json({ error: 'Connection failed. Please try again.' });
  }
};
