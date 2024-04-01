
const fetch = require('node-fetch');
require("dotenv").config();

const vocalResponse = {
    vocal_ttsResponse: async (prompt) => {
        const elevenlabs_key = 'bd495903759ed40c7abaa066bcd10a68';
        const voiceId = '8wz1bDBxKzlqXCHg578k';
        const base_url = "https://api.elevenlabs.io";
        const body = {
            text: prompt,
            voice_settings: {
                similarity_boost: 1,
                stability: 0.5,
                style: 1,
                use_speaker_boost: true
            }
        };

        const headers = {
            'Content-Type': 'application/json',
            'xi-api-key': elevenlabs_key
        };

        try {
            const response = await fetch(base_url + `/v1/text-to-speech/${voiceId}?output_format=mp3_22050_32`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const buffer = await response.buffer(); // Read response as buffer

            const base64Data = buffer.toString('base64'); // Convert buffer to base64 string

            return { audioDataUrl: base64Data };
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
};

module.exports = vocalResponse;
