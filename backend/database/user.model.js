const mongoose = require('mongoose');
const { decryptedPassword } = require('../helper/password.helpers');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { type: Boolean, default: false },
  currentPlan: { type: String, default: 'Basic/Free' },
  textMessagesLeft: { type: Number, default: 20 },
  voiceMessagesLeft: { type: Number, default: 10 },
  linkedAccounts: { type: Number, default: 0 },
  linked_accounts_info: { type: Array, default: [] },
  aiVoiceId: { type: String, default: '' },
  texting_prompt: { type: String, default: '' },
  ppv_prompt: { type: String, default: '' },
  sexting_prompt: { type: String, default: '' },
  question_prompt: { type: String, default: '' },
  customer_id: { type: String, default: '' },
  isEmoji: {
    type: Boolean,
    default: true
  },
  creatorData: {
    basicPersonalInformation: {
      name: { type: String, default: '' },
      nickName: { type: String, default: '' },
      countryAndCity: { type: String, default: '' },
      origins: { type: String, default: '' },
      silbings: { type: String, default: '' },
      relationship: {
        type: String,
        enum: ["single", "girlfriend", "openrelationship", "other"],
        default : 'single'
      }
    },
    typeOfcontent: {
      question: { type: String, default: '' },
      answer: { type: Array, default: '' }
    },
    physicalAttributes: {
      height: { type: String, default: '' },
      weight: { type: String, default: '' },
      shoeSize: { type: String, default: '' },
      breastSize: { type: String, default: '' },
      tattoos: { type: String, default: '' },
      piercings: { type: String, default: '' },
      plasticSurgery: { type: String, default: '' }
    },
    socialMedia: { instagram: { type: String, default: '' }, tiktok: { type: String, default: '' }, snapchatLink: { type: String, default: '' }, },
    personalInterest: {
      question: { type: String, default: '' },
      answer: { type: String, default: '' }
    },
    additionalInformation: {
      question: { type: String, default: '' },
      answer: { type: String, default: '' }
    },
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = async function comparePassword(password) {
  console.log(password, this.password)
  const bcryptedPass = await decryptedPassword(password, this.password)
  if (bcryptedPass)
    return true
  return false
}

const User = mongoose.model('User', userSchema);

module.exports = User;
