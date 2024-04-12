const User = require('../database/user.model');
const jwt = require('jsonwebtoken')
const axios = require('axios')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET)


function base64ToBlob(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    return blob;
  }


const useCredits = async (user,service) =>{
    if(service==='tts'){
        const amt = 1
        if(user.textMessagesLeft>=amt){
            user.textMessagesLeft-=1
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

    createStripeSession: async (planId,jwtToken)=>{
        try{
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({_id : user_id});
            if(!user)
                throw new Error("User not found")

            let planPrice;
            if(planId==='Starter')
                planPrice=19
            else if(planId==='Advanced')
                planPrice=49
            else if(planId==='Premium')
                planPrice=99
            else
                return -1
            const customerId = user.customer_id
            const createSession = await stripe.checkout.sessions.create({
                payment_method_types:['card'],
                customer: customerId,
                line_items:[{
                    price_data:{
                        currency:'usd',
                        product_data:{
                            name:`OnlyVocal ${planId} Subscription`   
                        },
                        unit_amount:planPrice*100,
                    },
                    quantity:1
                }],
                
                mode:'payment',
                success_url:`https://www.onlyvocal.ai/vocal/onlyfans/plans/${user.email}/payment/success`,
                cancel_url:`https://www.onlyvocal.ai/vocal/onlyfans/plans/${user.email}/payment/failure`
               
            })
            return createSession.id
        }
        catch(e){
            console.log(e)
            return -1
        }
    },
    updateUserBalance: async(userObj)=>{
        const customerId = userObj.data.object.customer
        const user = await User.findOne({customer_id:customerId});
        const amt = userObj.data.object.amount_subtotal
        let increaseText = 0;
	let increaseVoice= 0;
	let newPlan = 'Basic/Free'
        if(amt===1900){
        increaseText = 1000;
	increaseVoice = 1000;
	newPlan='Starter';
	}
        else if(amt===4900){
        increaseText = 2500;
	increaseVoice= 2500;
	newPlan='Advanced';
	}
        else if(amt===9900){
        increaseText = 5000;
	increaseVoice = 5000;
	newPlan='Premium';
	}
	console.log(increaseText, increaseVoice, newPlan, amt);
	user.currentPlan=newPlan;
	console.log(user.currentPlan, newPlan);
        user.textMessagesLeft += increaseText
	user.voiceMessagesLeft += increaseVoice
        await user.save()
    }

   

}



module.exports = protectedService



