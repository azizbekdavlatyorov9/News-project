const jwt = require("jsonwebtoken")

const access_token = (payload) => {
        return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "15s"})
}

const refresh_token = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "7d"})
}
module.exports = {
    access_token, 
    refresh_token
}