const User = require('../database/user.model');
const jwt = require('jsonwebtoken')


const protectedService = {
    userInfo : async (jwtToken)=>{
        try{
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({_id : user_id});
            return {email:user.email,name:user.name, subscription:user.subscription, messagesLeft:user.messagesLeft, currentPlan:user.currentPlan, linkedAccounts:user.linkedAccounts}
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
            console.log(user)
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
    }

}



module.exports = protectedService



