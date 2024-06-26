const User = require('../database/user.model');
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch');
require("dotenv").config();

const useCredits = async (user, service) => {
    if (service === 'genVoice') {
        const amt = 1
        if (user.voicecredit >= amt) {
            user.voicecredit -= amt
            await user.save()
            return 1
        }
        else
            return -1
    }
    else if (service === 'tts') {
        const amt = 1
        if (user.voicecredit >= amt) {
            user.voicecredit -= amt
            await user.save()
            return 1
        }
        else
            return -1
    }
}

const vocalResponse = {
    vocal_ttsResponse: async (token, prompt, voiceSettings) => {
        try {
            const verifyToken = jwt.verify(token, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({ _id: user_id });
            const flag = await useCredits(user, 'genVoice')
            if (flag === 1) {
                const elevenlabs_key = process.env.ELVAPI;
                const voiceId = user.aiVoiceId;
                const base_url = "https://api.elevenlabs.io";
                const body = {
                    text: prompt,
                    vocie_settings: voiceSettings
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
                    return -1;
                }
            }
            else {
                return -2
            }
        }
        catch (e) {
            return -1
        }
    },

    genVoice: async (jwtToken, genOptions) => {
        try {
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({ _id: user_id });
            const flag = await useCredits(user, 'genVoice')
            if (flag === 1) {
                const base_url = "https://api.elevenlabs.io";
                const options = {
                    method: 'POST',
                    headers: {
                        'xi-api-key': process.env.ELVAPI,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(genOptions)//'{"accent":"british","accent_strength":1,"age":"middle_aged","gender":"female","text":"qwwqewe"}'
                };
                try {
                    const response = await fetch(base_url + '/v1/voice-generation/generate-voice', options)
                    if (!response.ok) {
                        throw new Error('Failed to fetch');
                    }
                    const buffer = await response.buffer(); // Read response as buffer
                    const base64Data = buffer.toString('base64'); // Convert buffer to base64 string
                    return { audioDataUrl: base64Data };

                }
                catch (e) {
                    return -1
                }
            }
            else {
                return -2
            }
        }
        catch (e) {
            return -1
        }
    }
};

module.exports = vocalResponse;