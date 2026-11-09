const joi = require("joi");

//register
const register = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(64).required(),
    role: joi.forbidden()
})

const login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

const updateProfile = jioi.object({
    name:joi.string().min(2).max(50),
    email:joi.string().email()
}).min(1)
