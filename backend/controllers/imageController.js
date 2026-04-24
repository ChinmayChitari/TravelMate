const claudeService = require('../services/claudeService');

exports.identifyLandmark = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mediaType = req.file.mimetype;

    const systemPrompt = `You are a landmark identification AI. Identify this landmark. Return ONLY valid JSON with this exact structure: { "name": "", "location": "", "description": "", "bestTimeToVisit": "", "funFact": "", "category": "" }`;

    const response = await claudeService.sendMessage({
      model: 'anthropic/claude-3-haiku',
      max_tokens: 1000,
      system: systemPrompt,
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Identify this landmark.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mediaType};base64,${base64Image}`
              }
            }
          ]
        }
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
    console.error('Image processing error:', error.message);
    res.status(500).json({ error: 'Connection failed. Please try again.' });
  }
};
