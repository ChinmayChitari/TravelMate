const claudeService = require('../services/claudeService');

exports.handleChat = async (req, res, next) => {
  try {
    const { message, history, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
      });
    }
    messages.push({ role: 'user', content: message });

    const systemPrompt = `You are an expert AI travel guide. Answer questions about places, history, culture, food, tips. Be concise, enthusiastic, and helpful. Respond in the user's selected language: ${language || 'English'}.`;

    const response = await claudeService.sendMessage({
      model: 'anthropic/claude-3-haiku',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages
    });

    const reply = response.content[0].text;
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Connection failed. Please try again.' });
  }
};
