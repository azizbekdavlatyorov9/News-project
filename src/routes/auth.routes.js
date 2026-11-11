const Router = require('express')
const { Register, Login } = require('../controllers/auth.controller')


const authRouter = Router()

authRouter.post("/register", Register)
authRouter.post("/login", Login)


module.exports = authRouter