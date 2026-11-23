const Router = require('express')
const { Register, Login, Logout, changePassword, getMe, updateMe } = require('../controllers/auth.controller')
const { refresh_token } = require('../utils/token.generator')
const authenticate = require('../middlewares/authenticate')


const authRouter = Router()

authRouter.post("/register", Register)
authRouter.post("/login", Login),
authRouter.post("/refresh", refresh_token)
authRouter.post("/logout", authenticate, Logout)
authRouter.get('/profile', authenticate, getMe)
authRouter.put("/update-profile", authenticate, updateMe)
authRouter.put("/change-password", authenticate, changePassword)


module.exports = authRouter