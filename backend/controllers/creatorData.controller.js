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

            if (data.basicPersonalInformation) {
                user.creatorData.basicPersonalInformation = data.basicPersonalInformation;
            }

            if (data.typeOfcontent) {
                user.creatorData.typeOfcontent = data.typeOfcontent;
            }

            if (data.additionalInformation) {
                user.creatorData.additionalInformation = data.additionalInformation;
            }

            if (data.socialMedia) {
                user.creatorData.socialMedia = data.socialMedia;
            }

            if (data.personalInterest) {
                user.creatorData.personalInterest = data.personalInterest;
            }

            if (data.additionalInformation) {
                user.creatorData.additionalInformation = data.additionalInformation;
            }

            await user.save()
        }
        res.send(data)
    }
    catch (e) {
        return 0
    }
}

module.exports = { creatorData }