const speech = require('@google-cloud/speech');
const fs = require('fs');

/**
 * Speech Recognition Controller
 * - Uses Google Speech-to-Text API
 */
const client = new speech.SpeechClient();

exports.speechToText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const audioBytes = fs.readFileSync(req.file.path).toString('base64');

        const audio = {
            content: audioBytes,
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        };
        const request = {
            audio: audio,
            config: config,
        };

        // Detects speech in the audio file
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        res.json({ text: transcription });

    } catch (err) {
        console.error('ERROR:', err);
        res.status(500).send('Error processing audio file.');
    } finally {
        // Clean up uploaded file
        if (req.file) fs.unlinkSync(req.file.path);
    }
};
