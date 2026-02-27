const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Tour = require('../models/Tour');

// Load offline data
let offlineData = [];
try {
    const dataPath = path.join(__dirname, '../data/offlinePlaces.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    offlineData = JSON.parse(rawData).places || [];
} catch (err) {
    console.warn("Could not load offline places data:", err.message);
}

/**
 * Handles chat requests (both voice and text)
 * - Mocks response if no OpenAI key
 * - Uses OpenAI if key is present
 */
exports.chatGuide = async (req, res) => {
    const { message, place } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    try {
        // Check if user is asking about a known place FIRST (even with AI key) to provide robust facts?
        // Or only as fallback.
        // Let's use as context for AI or fallback.

        if (!apiKey) {
            console.warn("OpenAI API Key missing. Using mock/offline response.");

            // Simple keyword matching for offline data
            const lowerMsg = message.toLowerCase();
            const foundPlace = offlineData.find(p => lowerMsg.includes(p.name.toLowerCase()));

            if (foundPlace) {
                const reply = `(Offline Mode) Ah, user! asking about ${foundPlace.name}? ${foundPlace.description} Best time to visit is ${foundPlace.bestTime}.`;
                if (req.user) {
                    await Tour.create({ userId: req.user.id, placeName: foundPlace.name, description: reply });
                }
                return res.json({ reply });
            }

            // Default mock response
            const mockReply = `(Mock AI) That sounds interesting! Since I'm currently offline, I can't look up specific details about "${message}", but I can tell you about famous places like the Taj Mahal if you ask!`;
            if (req.user) {
                await Tour.create({ userId: req.user.id, placeName: 'Chat', description: mockReply });
            }
            return res.json({ reply: mockReply });
        }

        const SYSTEM_PROMPT = `
      You are a friendly, experienced human tour guide.
      You speak warmly, like explaining to a tourist beside you.
      You include history, fun facts, cultural tips, and emotions.
      Never sound robotic.
      You are currently at ${place || 'unknown location'}.
      Use only plain text, no markdown.
    `;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: message }
                ],
                max_tokens: 150
            },
            { headers: { Authorization: `Bearer ${apiKey}` } }
        );

        const aiReply = response.data.choices[0].message.content;
        if (req.user) {
            await Tour.create({
                userId: req.user.id,
                placeName: place || 'Chat',
                description: aiReply
            });
        }
        res.json({ reply: aiReply });
    } catch (err) {
        console.error("Chat Error:", err.message);
        res.status(500).json({ reply: "I'm having trouble connecting to my brain right now. Can we try again?" });
    }
};
