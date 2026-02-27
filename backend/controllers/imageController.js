const vision = require('@google-cloud/vision');
const Tour = require('../models/Tour');
const fs = require('fs');
const path = require('path');

let client;
try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        client = new vision.ImageAnnotatorClient();
    } else {
        console.warn("Google Vision API key (GOOGLE_APPLICATION_CREDENTIALS) missing. Using mock vision.");
    }
} catch (err) {
    console.warn("Failed to initialize Google Vision:", err);
}

/**
 * Image Analysis Controller
 * - Uses Google Vision API to identify landmarks
 * - Fallback to mock data if API unavailable
 */
exports.analyzeImage = async (req, res) => {
    try {
        const { image } = req.body; // Expecting base64 string

        if (!image) {
            return res.status(400).json({ error: "No image provided" });
        }

        if (!client) {
            const payload = {
                name: "Gateway of India (Mock)",
                description: "A historic monument built in 1924 during British rule. (This is a mock response as no API key was provided)",
                bestTime: "Early morning or evening",
                confidence: 0.95
            };
            if (req.user) {
                await Tour.create({ userId: req.user.id, placeName: payload.name, description: payload.description });
            }
            return res.json(payload);
        }

        // Convert base64 to buffer? Or Vision supports base64 string directly via 'image: { content: base64 }'
        // Ensure 'image' is the base64 string without data:image/jpeg;base64 prefix
        const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

        const [result] = await client.landmarkDetection({
            image: { content: base64Image }
        });

        const landmark = result.landmarkAnnotations[0];

        if (!landmark) {
            return res.json({
                name: "Unknown Place",
                description: "Could not identify this landmark. Try getting a clearer shot!",
                confidence: 0
            });
        }

        const payload = {
            name: landmark.description,
            location: landmark.locations,
            description: `Identified as ${landmark.description}. A waiting for detailed info.`,
            confidence: landmark.score
        };
        if (req.user) {
            await Tour.create({ userId: req.user.id, placeName: payload.name, description: payload.description });
        }
        res.json(payload);

    } catch (err) {
        console.error("Image Analysis Error:", err);
        res.status(500).json({ error: "Failed to analyze image" });
    }
};
