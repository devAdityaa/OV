const User = require('../database/user.model');
const jwt = require('jsonwebtoken')


const authService = {
    userInfo : async (jwtToken)=>{
        try{
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({_id : user_id});
            return {email:user.email,name:user.name, subscription:user.subscription, messagesLeft:user.messagesLeft, currentPlan:user.currentPlan, linkedAccounts:user.linkedAccounts,texting:user.texting_prompt,sexting: user.sexting_prompt,question:user.question_prompt,ppv:user.ppv_prompt}
        }
        catch(e){
            return -1
        }
        
    },
    registerNewUser : async (name, email, password)=>{
        try{
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return -1
            }
        
            const newUser = new User({ name, email, password });
            await newUser.save();
            return 1   
        }
        catch(e){
            console.log("Error: ", e)
            return 0
        }
           
        
    },
    loginUser : async (email, password)=>{
        try{
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return [-1]
            }
            
            const isPasswordValid = await existingUser.comparePassword(password);
            if(!isPasswordValid){
                return [-2]
            }
            
            const token = jwt.sign({ userId: existingUser._id }, 'secretKey');
            return [1,token]  
        }
        catch(e){
            console.log("Error: ", e)
            return [0]
        }
           
        
    }

}



module.exports = authService



