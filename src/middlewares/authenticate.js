const jwt = require('jsonwebtoken')
const CustomErrorHandler = require("../error/error");

module.exports = async function authenticate(req, res, next) {
    try {
        let token = null;
        
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }else if()

        if (!token) {
            throw CustomErrorHandler.BadRequest("No token provided")
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decode
        next()
    } catch (error) {
        next(error)
    }

} 
