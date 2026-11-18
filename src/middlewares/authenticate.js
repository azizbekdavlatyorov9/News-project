const jwt = require('jsonwebtoken')
const CustomErrorHandler = require("../error/error");
const User = require("../schema/users.schema.js")

module.exports = async function authenticate(req, res, next) {
    try {
        let token = null;
        
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }else if(req.cookies && req.cookies.accessToken){
            token = req.cookies.accessToken
        }

        if (!token) {
            throw CustomErrorHandler.UnAuthorized("No token provided")
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findById(decode.id || decode._id)
        if(!user) {
            throw CustomErrorHandler.UnAuthorized("Foydalanuvchi topilmadi")
        }
        if(user.isBlocked) {
            throw CustomErrorHandler.Forbidden("Sizning akkauntingiz bloklangan")
        }
        if(decode.tokenVersion !== undefined && user.tokenVersion !== decode.tokenVersion ){
            throw CustomErrorHandler.UnAuthorized("Token eskirgan")
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }

} 
