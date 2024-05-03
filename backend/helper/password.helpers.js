const bcrypt = require('bcrypt')

const encryptedPassword = async (password) => {
    const saltRound = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, saltRound)
    return hashPassword
}

const decryptedPassword = async (password, userpassword) => {
    const result = await bcrypt.compare(password, userpassword)
    return result
}

module.exports = { encryptedPassword, decryptedPassword }