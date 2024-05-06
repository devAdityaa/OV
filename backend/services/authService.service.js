const User = require('../database/user.model');
const jwt = require('jsonwebtoken')
const { encryptedPassword } = require('../helper/password.helpers')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const createNewStripeCustomer = async (name, email) => {
    try {
        const customer = await stripe.customers.create({
            name,
            email,
            description: 'OnlyVocal Subscriber',
        })
        const c_id = customer.id
        return c_id
    }
    catch (e) {
        throw new Error("Couldnt create customer")
    }
}

const authService = {
    userInfo: async (jwtToken) => {
        try {
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({ _id: user_id });
            return { email: user.email, name: user.name, subscription: user.subscription, textcredit: user.textcredit, voicecredit: user.voicecredit, currentPlan: user.currentPlan, linkedAccounts: user.linkedAccounts, texting: user.texting_prompt, sexting: user.sexting_prompt, question: user.question_prompt, ppv: user.ppv_prompt, isEmoji: user.isEmoji, creatorData: user.creatorData }
        }   
        catch (e) {
            return -1
        }
    },
    registerNewUser: async (name, email, password) => {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return -1
            }
            const hashpassword = await encryptedPassword(password)
            const newUser = new User({ name, email, password: hashpassword });
            const customerId = await createNewStripeCustomer(name, email)
            newUser.customer_id = customerId
            await newUser.save();
            return 1
        }
        catch (e) {
            return 0
        }
    },
    loginUser: async (email, password) => {
        try {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return [-1]
            }
            const isPasswordValid = await existingUser.comparePassword(password);
            if (!isPasswordValid) {
                return [-2]
            }
            const token = jwt.sign({ userId: existingUser._id }, 'secretKey');
            return [1, token]
        }
        catch (e) {
            return [0]
        }
    },
}

module.exports = authService