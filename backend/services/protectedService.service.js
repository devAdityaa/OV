const User = require('../database/user.model');
const jwt = require('jsonwebtoken')
const axios = require('axios')
require('dotenv').config()



function base64ToBlob(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    return blob;
  }


const useCredits = async (user,service) =>{
    if(service==='tts'){
        const amt = 5
        if(user.messagesLeft>=amt){
            user.messagesLeft-=5
            await user.save()
        }      
        else
            return -1
    }
}


const updateVoiceId = async (newId, user)=>{
    const oldId = user.aiVoiceId
    if(oldId!==''){
        try{
            const options = {method: 'DELETE', headers: {'xi-api-key': process.env.ELVAPI}};
            const response=  await fetch('https://api.elevenlabs.io/v1/voices/'+oldId, options)
            const resObj = await response.json()
        }
        catch(e){
            console.log(e)
        }
        
    }
    user.aiVoiceId = newId
    await user.save()
}



const protectedService = {
    userInfo : async (jwtToken)=>{
        try{
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({_id : user_id});
            return {email:user.email,name:user.name, subscription:user.subscription, messagesLeft:user.messagesLeft, currentPlan:user.currentPlan, linkedAccounts:user.linkedAccounts, texting:user.texting_prompt,sexting: user.sexting_prompt,question:user.question_prompt,ppv:user.ppv_prompt}
        }
        catch(e){
            return -1
        }
        
    },

    setOfAccounts : async (jwtToken, accounts)=>{
        try{
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({_id : user_id});
            if(!user)
                throw new Error("User not found")
            user['linked_accounts_info'] = accounts
            user["linkedAccounts"] = accounts.length
            await user.save();
            return 1
        }
        catch(e){
            console.log("Error,", e)
            return -1
        }
    },
    getOfAccounts : async (jwtToken)=>{
        try{
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({_id : user_id});
            if(!user)
                throw new Error("User not found")
            return {accounts:user['linked_accounts_info']}
        }
        catch(e){
            console.log("Error,", e)
            return -1
        }
    },

    cloneVoice : async (jwtToken, files, description)=>{
        try{
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({_id : user_id});

                    const audioDataArray = files;

                    const form = new FormData();
                    form.append("name", user.email);
                    form.append("description", description);
                    audioDataArray.forEach((base64Item, index) => {
                        const blob = base64ToBlob(base64Item);
                        form.append('files', blob); // Assuming audio data is sent as base64 strings
                    });
                    
                    const options = {
                      method: 'POST',
                      headers: {
                        'xi-api-key': process.env.ELVAPI
                       
                      }
                    };
                    
                    options.body = form;
                    
                    fetch('https://api.elevenlabs.io/v1/voices/add', options)
                      .then(response => response.json())
                      .then(async response => {
                        const voiceId = response.voice_id
                        console.log('voiceId')
                        await updateVoiceId(voiceId,user)
                        return 1
                    })
                      .catch(err => {
                        console.log(err)
                        return -1
                      });

      


        }
        catch(e){
            console.log(e)
            return -1
        }
    },



   

}



module.exports = protectedService



