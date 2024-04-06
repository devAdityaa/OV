const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: {type: Boolean, default: false},
    currentPlan: {type: String, default: 'Basic/Free'},
    messagesLeft: {type: Number, default:0},
    linkedAccounts: {type:Number, default:0},
    linked_accounts_info: {type:Array, default:[]},
    aiVoiceId: {type:String, default:''},
    texting_prompt: {type:String, default: ''},
    ppv_prompt: {type:String, default:''},
    sexting_prompt: {type:String, default: ''},
    question_prompt: {type:String, default:''},
    createdAt: { type: Date, default: Date.now },
  });

  userSchema.methods.comparePassword = function comparePassword(password){
    console.log(password,this.password)
    if(this.password===password)
    return true
    return false
}


const User = mongoose.model('User', userSchema);

module.exports = User;