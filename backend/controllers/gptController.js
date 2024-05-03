const gptResponse = require('../services/gptResponse.service')
const vocalResponse = require('../services/vocalResponse.service')
const gptController = {

    getShortResponse: async (req, res) => {
        try {
            let token = req.headers.authorization
            const messages = req.body.messages
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const response = await gptResponse.shortResponse(token, messages)

                if (response !== -1 && response !== -2) {
                    res.status(200).json({ statusCode: 100, 'short-response': response })
                }
                else if (response === -1)
                    res.status(500).json({ statusCode: 99, message: 'Not Enough Credits' })
                else
                    res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
        }
    },

    getLongResponse: async (req, res) => {
        try {
            let token = req.headers.authorization
            const messages = req.body.messages
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const response = await gptResponse.longResponse(token, messages)
                if (response !== -1 && response !== -2) {
                    res.status(200).json({ statusCode: 100, 'long-response': response })
                }
                else if (response === -1)
                    res.status(500).json({ statusCode: 99, message: 'Not Enough Credits' })
                else
                    res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
        }
    },

    getTextingResponse: async (req, res) => {
        try {
            let token = req.headers.authorization
            const messages = req.body.messages
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const response = await gptResponse.textingResponse(token, messages)
                if (response !== -1 && response !== -2) {
                    res.status(200).json({ statusCode: 100, 'texting-response': response })
                }
                else if (response === -1)
                    res.status(500).json({ statusCode: 99, message: 'Not Enough Credits' })
                else {
                    res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
                }
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
        }
    },

    getPpvResponse: async (req, res) => {
        try {
            let token = req.headers.authorization
            const messages = req.body.messages
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const response = await gptResponse.ppvResponse(token, messages)
                if (response !== -1 && response !== -2) {
                    res.status(200).json({ statusCode: 100, 'ppv-response': response })
                }
                else if (response === -1)
                    res.status(500).json({ statusCode: 99, message: 'Not Enough Credits' })
                else
                    res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
        }
    },

    getQuestionResponse: async (req, res) => {
        try {
            let token = req.headers.authorization
            const messages = req.body.messages
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const response = await gptResponse.questionResponse(token, messages)
                if (response !== -1 && response !== -2) {
                    res.status(200).json({ statusCode: 100, 'question-response': response })
                }
                else if (response === -1)
                    res.status(500).json({ statusCode: 99, message: 'Not Enough Credits' })
                else
                    res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
        }
    },

    getSextingResponse: async (req, res) => {
        try {
            let token = req.headers.authorization
            const messages = req.body.messages
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const response = await gptResponse.sextingResponse(token, messages)
                if (response !== -1 && response !== -2) {
                    res.status(200).json({ statusCode: 100, 'sexting-response': response })
                }
                else if (response === -1)
                    res.status(500).json({ statusCode: 99, message: 'Not Enough Credits' })
                else
                    res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99, message: 'Something Went Wrong' })
        }
    },

    getVocalResponse: async (req, res) => {
        try {
            let token = req.headers.authorization
            const text = req.body.text;
            let voiceSettings;
            if (req.body.settings)
                voiceSettings = req.body.settings
            else
                voiceSettings = { similarity_boost: 1, stability: 0.5, style: 1, use_speaker_boost: true }
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const response = await vocalResponse.vocal_ttsResponse(token, text, voiceSettings)
                if (response !== -1 && response !== -2) {
                    res.status(200).send({ statusCode: 100, 'audioDataUrl': response.audioDataUrl })
                }
                else if (response === -2) {
                    res.status(500).send({ statusCode: 99, message: 'Not enough credits' })
                }
                else {
                    res.status(500).send({ statusCode: 99, message: 'Something went wrong' })
                }
            }
        } catch (e) {
            res.status(500).send({ statusCode: 99, message: 'Something went wrong' })
        }
    },

    genVoice: async (req, res) => {
        try {
            let token = req.headers.authorization
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const getVoice = await vocalResponse.genVoice(token, req.body.genOptions)
                if (getVoice !== -1 || getVoice !== -2) {
                    res.status(200).json({ statusCode: 100, 'audioDataUrl': getVoice.audioDataUrl })
                }
                else if (getVoice === -2)
                    res.status(500).json({ statusCode: 99, message: 'Not enough credits' })
                else
                    res.status(500).json({ statusCode: 99, message: 'Something went wrong' })
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99, message: 'Something went wrong' })
        }
    },

    updatePrompts: async (req, res) => {
        try {
            let isEmoji = req.body.isEmoji
            let token = req.headers.authorization
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const getVoice = await gptResponse.updatePrompts(token, req.body.userPrompts, isEmoji)
                if (getVoice !== -1) {
                    res.status(200).json({ statusCode: 100, isEmoji: isEmoji })
                }
                else
                    res.status(500).json({ statusCode: 99 })
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99 })
        }
    }
}

module.exports = gptController