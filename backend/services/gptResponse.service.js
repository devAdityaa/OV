const { OpenAI } = require('openai');
require("dotenv").config();

const shortPrompt= '\n!important: Make your Responses Very Short and One Liner.'
const longPrompt = '\n !important: Make your responses brief but not too long.'
const textingPrompt = '\n'
const ppvPrompt = "\n"
const questionPrompt = "\n Responses should not be too long."
const sextingPrompt = '\n !important: Elevate the conversation with a sexier, naughtier tone, carefully building on the nature of previous exchanges with the model to ensure comfort and consent. Based on content creator preference. Responses should not be too long. '

const gptResponse = {
   
    shortResponse: async (prompt)=>{

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        try{
         prompt.messages[0].content += shortPrompt
            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages:prompt.messages,
                temperature: 1.5
            });
            const responseText = response.choices[0]['message']['content'];
            return responseText;
        }
        catch(e){
            let errorMsg;
            if(e.status===403){
                console.log("403 Error Noticed, error details:",e.detail)
                errorMsg = "Couldn't proceed with the request. Tip: make sure you're not exposing any sensitive data."
                return errorMsg
            }
            errorMsg = "Something went wrong"
            console.log(e)
            return errorMsg    
        }
        
    },
    longResponse: async (prompt)=>{

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        try{
            prompt.messages[0].content += longPrompt
            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: prompt.messages,
                temperature: 1.5
        
            });
            const responseText = response.choices[0]['message']['content'];
            return responseText;
        }
        catch(e){
            let errorMsg;
            if(e.status===403){
                console.log("403 Error Noticed, error details:",e.detail)
                errorMsg = "Couldn't proceed with the request. Tip: make sure you're not exposing any sensitive data."
                return errorMsg
            }
            errorMsg = "Something went wrong"
            return errorMsg    
        }
        
    },
    textingResponse: async (prompt)=>{

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        try{
            prompt[0].content += textingPrompt
            console.log("Services: ",{
                model: "gpt-3.5-turbo",
                messages: prompt,
                temperature: 1.5
        
            })
            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: prompt,
                temperature: 1.5
        
            });
            const responseText = response.choices[0]['message']['content'];
            return responseText;
        }
        catch(e){
            let errorMsg;
            if(e.status===403){
                console.log("403 Error Noticed, error details:",e.detail)
                errorMsg = "Couldn't proceed with the request. Tip: make sure you're not exposing any sensitive data."
                return errorMsg
            }
            errorMsg = "Something went wrong"
            return errorMsg    
        }
        
    },
    ppvResponse: async (prompt)=>{

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        try{
            prompt[0].content += ppvPrompt
            console.log("Services: ",prompt)
            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: prompt,
                temperature: 1.5
        
            });
            const responseText = response.choices[0]['message']['content'];
            return responseText;
        }
        catch(e){
            let errorMsg;
            if(e.status===403){
                console.log("403 Error Noticed, error details:",e.detail)
                errorMsg = "Couldn't proceed with the request. Tip: make sure you're not exposing any sensitive data."
                return errorMsg
            }
            errorMsg = "Something went wrong"
            return errorMsg    
        }
        
    },
   questionResponse: async (prompt)=>{

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    try{
        prompt[0].content += questionPrompt
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: prompt,
            temperature: 1.5
    
        });
        const responseText = response.choices[0]['message']['content'];
        return responseText;
    }
    catch(e){
        let errorMsg;
        if(e.status===403){
            console.log("403 Error Noticed, error details:",e.detail)
            errorMsg = "Couldn't proceed with the request. Tip: make sure you're not exposing any sensitive data."
            return errorMsg
        }
        errorMsg = "Something went wrong"
        return errorMsg    
    }
    
},
    sextingResponse: async (prompt)=>{

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        try{
            prompt[0].content += sextingPrompt
            console.log("Services: ",prompt)
            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: prompt,
                temperature: 1.5
        
            });
            const responseText = response.choices[0]['message']['content'];
            return responseText;
        }
        catch(e){
            let errorMsg;
            if(e.status===403){
                console.log("403 Error Noticed, error details:",e.detail)
                errorMsg = "Couldn't proceed with the request. Tip: make sure you're not exposing any sensitive data."
                return errorMsg
            }
            errorMsg = "Something went wrong"
            return errorMsg    
        }
        
    },
}

module.exports = gptResponse