const jwt = require('jsonwebtoken');
const User = require('../database/user.model');

const creatorData = async (req, res) => {
    try {
        const data = req.body
        let token = req.headers.authorization
        if (token) {
            if (token.includes('Bearer'))
                token = token.split(' ')[1]
            const verifyToken = jwt.verify(token, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({ _id: user_id });

            if (data.creatorData.basicPersonalInformation) {
                user.creatorData.basicPersonalInformation = data.creatorData.basicPersonalInformation;
            }

            if (data.creatorData.typeOfcontent) {
                user.creatorData.typeOfcontent = data.creatorData.typeOfcontent;
            }

            if (data.creatorData.additionalInformation) {
                user.creatorData.additionalInformation = data.creatorData.additionalInformation;
            }

            if (data.creatorData.socialMedia) {
                user.creatorData.socialMedia = data.creatorData.socialMedia;
            }

            if (data.creatorData.personalInterest) {
                user.creatorData.personalInterest = data.creatorData.personalInterest;
            }

            if (data.creatorData.additionalInformation) {
                user.creatorData.additionalInformation = data.creatorData.additionalInformation;
            }
            await user.save();
        }
        res.send(data)
    }
    catch (e) {
        return 0
    }
}

module.exports = { creatorData }