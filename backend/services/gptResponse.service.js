const { OpenAI } = require('openai');
const User = require('../database/user.model');
const jwt = require('jsonwebtoken')
require("dotenv").config();

const shortPrompt= '\n!important: Make your Responses Very Short and One Liner.'
const longPrompt = '\n !important: Make your responses brief but not too long.'
const textingPrompt = '\n'
const ppvPrompt = "\n"
const questionPrompt = "\n Responses should not be too long."
const sextingPrompt = '\n !important: Elevate the conversation with a sexier, naughtier tone, carefully building on the nature of previous exchanges with the model to ensure comfort and consent. Based on content creator preference. Responses should not be too long. '





const useCredits = async (token,service) =>{
    try{
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({_id : user_id});

        if(service==='short-res' || service==='long-res'){
            const amt = 1
            if(user.textMessagesLeft>=amt){
                user.textMessagesLeft-=amt
                await user.save()
                return [1]
            }      
            else
                return [-1]
        }
        else if(service==='texting'){
            const amt = 1
            if(user.textMessagesLeft>=amt){
                user.textMessagesLeft-=amt
                await user.save()
                const prompt = user.texting_prompt
                return [1,prompt]
            }      
            else
                return [-1]
        }
        else if(service==='sexting'){
            const amt = 1
            if(user.textMessagesLeft>=amt){
                user.textMessagesLeft-=amt
                await user.save()
                const prompt = user.sexting_prompt
                return [1,prompt]
            }      
            else
                return [-1]
        }
        else if(service==='question'){
            const amt = 1
            if(user.textMessagesLeft>=amt){
                user.textMessagesLeft-=amt
                await user.save()
                const prompt = user.question_prompt
                return [1,prompt]
            }      
            else
                return [-1]
        }
        else if(service==='ppv'){
            const amt = 1
            if(user.textMessagesLeft>=amt){
                user.textMessagesLeft-=amt
                await user.save()
                const prompt = user.ppv_prompt
                return [1,prompt]
            }      
            else
                return [-1]
        }

    }
    catch(e){
	    console.log("Error Encountered!",e)
        return [-2]
    }
    
}




const gptResponse = {
   
    shortResponse: async (token,prompt)=>{

        const flag = await useCredits(token,'short-res')
        if(flag[0]===1){
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
                return -2
            }
        }
        else if(flag[0]===-1){
            return -1
        }
        else if(flag[0]===-2){
            return -2
        }
        
    },
    longResponse: async (token, prompt)=>{
        const flag = await useCredits(token,'long-res')
        if(flag[0]===1){
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try{
		    console.log("Long",prompt)
             prompt.messages[0].content += longPrompt
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages:prompt.messages,
                    temperature: 1.5
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch(e){
                console.log("Unexpected Error",e)
                return -2
            }
        }
        else if(flag[0]===-1){
            return -1
        }
        else if(flag[0]===-2){
            return -2
        }
    },
    textingResponse: async (token, prompt)=>{
        const flag = await useCredits(token,'texting')
        if(flag[0]===1){
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try{
		    console.log("texting:",prompt)
		   
             prompt.messages[0].content += textingPrompt+flag[1]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages:prompt.messages,
                    temperature: 1.5
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch(e){
               console.log("Unexpected error",e)
                return -2
            }
        }
        else if(flag[0]===-1){
            return -1
        }
        else if(flag[0]===-2){
            return -2
        }
       
        
    },
    ppvResponse: async (token, prompt)=>{

        const flag = await useCredits(token,'ppv')
        if(flag[0]===1){
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try{
		    console.log("ppv",prompt)
		 
             prompt[0].content += ppvPrompt+flag[1]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages:prompt,
                    temperature: 1.5
                });
		   
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch(e){
               	console.log("Unexpected Error",e)
                return -2
            }
        }
        else if(flag[0]===-1){
            return -1
        }
        else if(flag[0]===-2){
            return -2
        }
       
        
    },
   questionResponse: async (token, prompt)=>{

    const flag = await useCredits(token,'question')
    if(flag[0]===1){
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        try{
         prompt[0].content += questionPrompt+flag[1]
            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages:prompt,
                temperature: 1.5
            });
            const responseText = response.choices[0]['message']['content'];
            return responseText;
        }
        catch(e){
            let errorMsg;
            return -2
        }
    }
    else if(flag[0]===-1){
        return -1
    }
    else if(flag[0]===-2){
        return -2
    }
    
},
    sextingResponse: async (token, prompt)=>{

        const flag = await useCredits(token,'sexting')
        if(flag[0]===1){
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try{
             prompt[0].content += sextingPrompt+flag[1]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages:prompt,
                    temperature: 1.5
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch(e){
                let errorMsg;
                return -2
            }
        }
        else if(flag[0]===-1){
            return -1
        }
        else if(flag[0]===-2){
            return -2
        }
        
    },

    updatePrompts: async (jwtToken, prompts)=>{
        try{
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({_id : user_id});
            user.texting_prompt = prompts.texting,
            user.sexting_prompt = prompts.sexting,
            user.ppv_prompt = prompts.ppv,
            user.question_prompt = prompts.question
            await user.save()
       
        }
        catch(e){
            return -1
        }
    }
}

module.exports = gptResponse
