module.exports = function authenticate(req, res, next) {
    try{
        const token = req.cookies.accessToken
    }catch(error){
        next(error)
    }

} 