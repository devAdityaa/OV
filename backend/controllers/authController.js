const authService = require('../services/authService.service')
const authController = {
    getUserInfo: async (req, res) => {
        try {
            let token = req.headers.authorization
            if (token) {
                if (token.includes('Bearer'))
                    token = token.split(' ')[1]
                const user_info = await authService.userInfo(token)
                if (user_info !== -1) {
                    res.status(200).json(user_info)
                }
                else
                    res.status(500).json({ statusCode: 99 })
            }
        }
        catch (e) {
            res.status(500).json({ statusCode: 99 })
        }
    },

    registerUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const responseFromDb = await authService.registerNewUser(name, email, password)
            if (responseFromDb === -1) {
                res.status(400).json({ statusCode: 101 });
            }
            else if (responseFromDb === 0) {
                res.status(500).json({ statusCode: 99 });
            }
            else if (responseFromDb === 1) {
                res.status(201).json({ statusCode: 100 });
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const responseFromDb = await authService.loginUser(email, password)

            if (responseFromDb[0] === -1) {
                res.status(400).json({ statusCode: 101 });
            }
            else if (responseFromDb[0] === -2) {
                res.status(400).json({ statusCode: 102 });
            }
            else if (responseFromDb[0] === 0) {
                res.status(500).json({ statusCode: 99 });
            }
            else if (responseFromDb[0] === 1) {
                res.status(201).json({ statusCode: 100, vocalToken: responseFromDb[1], user_id: email });
            }

        } catch (error) {
            console.error('Error registering user:', error);
        }

    },

}

module.exports = authController