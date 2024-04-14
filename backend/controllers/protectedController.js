const protectedService = require('../services/protectedService.service')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

function createAudioFile(audioDataUrl, fileName) {
    const binaryDataString = atob(audioDataUrl.split(',')[1]);
    const binaryData = new Uint8Array(binaryDataString.length);
    for (let i = 0; i < binaryDataString.length; i++) {
        binaryData[i] = binaryDataString.charCodeAt(i);
    }
    const blob = new Blob([binaryData], { type: 'audio/wav' });
    const audioFile = new File([blob], fileName, { type: 'audio/wav' });
    return audioFile;
}


const protectedController = {
   
    setOFA: async(req,res)=>{
        try{
            let token = req.headers.authorization
            if(token){
                if(token.includes('Bearer'))
                token = token.split(' ')[1]
                const setAccounts = await protectedService.setOfAccounts(token, req.body.accounts)
                if(setAccounts!==-1){
                    res.status(200).json({status:'OK', statusCode:100})
                }
                else
                    res.status(500).json({statusCode:99})
            }
        }
        catch(e){
            res.status(500).json({statusCode:99})
        }
    },
    getOFA: async(req,res)=>{
        try{
            let token = req.headers.authorization
            if(token){
                if(token.includes('Bearer'))
                token = token.split(' ')[1]
                const getAccounts = await protectedService.getOfAccounts(token)
                if(getAccounts!==-1){
                    res.status(200).json({accounts:getAccounts.accounts, statusCode:100})
                }
                else
                    res.status(500).json({statusCode:99})
            }
        }
        catch(e){
            res.status(500).json({statusCode:99})
        }
    },

    cloneVoice: async (req,res)=>{
        try{
            let token = req.headers.authorization
            if(token){
                if(token.includes('Bearer'))
                token = token.split(' ')[1]
                const getVoiceId = await protectedService.cloneVoice(token, req.body.audioFiles, req.body.description)
                if(getVoiceId!==-1){
                    res.status(200).json({statusCode:100})
                }
                else
                    res.status(500).json({statusCode:99})
            }
        }
        catch(e){
            res.status(500).json({statusCode:99})
        }
    },
    createStripeSession: async (req,res)=>{
        try{
	    console.log("Creating new stripe session")
            let token = req.headers.authorization
            if(token){
                if(token.includes('Bearer'))
                token = token.split(' ')[1]
                const planId = req.headers.plantype
                const createPaymentSession = await protectedService.createStripeSession(planId,token)
                if(createPaymentSession===-1){
                    res.send({statusCode:99, error:'Problem occured while creating payment session'})
                }
                else{
                    res.send({session:createPaymentSession})
                }
            }
            
        }
        catch(e){
            res.status(500).json({statusCode:99})
        }
        
        

    },
    stripeWebhook: async (req,res)=>{
     try {
            const sig = req.headers['stripe-signature'];
            let event;
	     console.log("sig forwarded:",sig,"Our sig",process.env.STRIPE_ENDPOINT_SECRET);
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
            switch (event.type) {
              case 'payment_intent.succeeded':
                const updateBalance = await protectedService.updateUserBalance(req.body)
                res.status(200).send(`Success`);
                break;
              default:
                console.log(`Unhandled event type ${event.type}`);
		res.status(200).send('Unhandled webhook event: only listening to payment_intent.succeeded')
            }
          } catch (err) {
            console.log("Stripe Error", err.message)
            res.status(400).send(`Webhook Error: ${err.message}`);
              return;
            } 
    }    
   
}

module.exports = protectedController
