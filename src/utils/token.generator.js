const jwt = require("jsonwebtoken")

const generateTokens = (user) => {
    const payload = {
        id:user._id,
        role:user.role,
        tokenVersion:user.tokenVersion
    }
}

const access_token = (payload) => {
        return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "15s"})
}

const refresh_token = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "7d"})
}
module.exports = {
    generateTokens,
    access_token, 
    refresh_token,
}