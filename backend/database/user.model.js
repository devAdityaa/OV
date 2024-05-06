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
        default: 'single'
      }
    },
    typeOfcontent: {
      content: { type: Array, default: '' },
      communication : { type: Array, default: '' },
      sortOfContent : { type: Array, default: '' }
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
      work: { type: String, default: '' },
      smoke: { type: String, default: '' },
      drink: { type: String, default: '' },
      partying: { type: String, default: '' },
      hobbies: { type: String, default: '' },
      color: { type: String, default: '' },
      food: { type: String, default: '' },
      show: { type: String, default: '' },
      movie: { type: String, default: '' },
      music: { type: String, default: '' },
      book: { type: String, default: '' },
      game: { type: String, default: '' },
    },
    additionalInformation: {
      additional: { type: String, default: '' },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = async function comparePassword(password) {
  const bcryptedPass = await decryptedPassword(password, this.password)
  if (bcryptedPass)
    return true
  return false
}

const User = mongoose.model('User', userSchema);

module.exports = User;