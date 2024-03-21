const gptResponse = require('../services/gptResponse.service')
const vocalResponse = require('../services/vocalResponse.service')
const gptController = {

    getShortResponse : (req,res)=>{
        //[{ 'role': 'user', 'content': `${command.body.text}` }];
    const messages = req.body.messages
        const response = gptResponse.shortResponse(messages)
        .then((responseText=>{
            res.send({'short-response':responseText})
        }))
        
    },
    getLongResponse : (req,res)=>{
        //[{ 'role': 'user', 'content': `${command.body.text}` }];
    const messages = req.body.messages
        const response = gptResponse.shortResponse(messages)
        .then((responseText=>{
            res.send({'long-response':responseText})
        }))
        
    },
    getTextingResponse : (req,res)=>{
        //[{ 'role': 'user', 'content': `${command.body.text}` }];
    const messages = req.body.messages
        const response = gptResponse.textingResponse(messages)
        .then((responseText=>{
            res.send({'texting-response':responseText})
        }))
        
    },
    getPpvResponse : (req,res)=>{
        //[{ 'role': 'user', 'content': `${command.body.text}` }];
    const messages = req.body.messages
        const response = gptResponse.ppvResponse(messages)
        .then((responseText=>{
            res.send({'ppv-response':responseText})
        }))
        
    },
    getQuestionResponse : (req,res)=>{
        //[{ 'role': 'user', 'content': `${command.body.text}` }];
    const messages = req.body.messages
        const response = gptResponse.questionResponse(messages)
        .then((responseText=>{
            res.send({'question-response':responseText})
        }))
        
    },
    getSextingResponse : (req,res)=>{
        //[{ 'role': 'user', 'content': `${command.body.text}` }];
    const messages = req.body.messages
        const response = gptResponse.sextingResponse(messages)
        .then((responseText=>{
            res.send({'sexting-response':responseText})
        }))
        
    },

    getVocalResponse : (req,res)=>{
        console.log("VOCAL PRESSED!", req.body.text)
        const text = req.body.text;
        const response = vocalResponse.vocal_ttsResponse(text)
        .then(response=>{
            console.log({'audioUrl':response.audioDataUrl})
            res.send({'audioDataUrl':response.audioDataUrl})
        })
       
    }
}

module.exports = gptController