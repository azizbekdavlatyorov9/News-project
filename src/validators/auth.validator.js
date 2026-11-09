const joi = require("joi");


const objectid = joi.string()
.hex()
.length(24)
.messages({
    'string.hex': 'ObjectId faqat hex belgilardan iborat bo\'lishi kerak',
    'string.length':'ObjectId 24 belgidan iborat bo\'lishi kerak',
});

const slug = joi.string()
.trim()
.lowercase()
.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*/)
.messages({'string.pattern.base': 'slug noto\'g\'ri formatda'})

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

const updateProfile = joi.object({
    name: joi.string().min(2).max(50),
    email: joi.string().email()
}).min(1)

const changePassword = joi.object({
    currentPassword: joi.string().min(8).max(64).required(),
    newPassword: joi.string().min(8).max(64).required()
})

//News

const newsFields = {
    title: joi.string().trim().min(5).max(200),
    description:joi.string().trim().min(20),
    category:objectid,
    tags: joi.array().items(objectid).max(10).single().default([]),
}

const createNews = joi.object({
    title: newsFields.title.required(),
    description: newsFields.description.required(),
    category: newsFields.category.required(),
    tags: newsFields.tags
})

const updateNews = joi.object({
    title:newsFields.title,
    description:newsFields.description,
    category:newsFields.category,
    tags:joi.array().items(objectid).max(10).single(),
    removeImages:joi.array().items(joi.string().trim()).single()
})
.min(1)
.messages({'object.min':"Kamida bitta maydon yuborilishi kerak"})

//Query

const newsQuery = joi.object({
    page:joi.number().integer().min(1).default(1),
    limit:joi.number().integer().min(1).max(50).default(10),
    q:joi.string().trim().max(100).allow(''),
    category:slug,
    tag:slug,
    sort:joi.string().valid('newest', 'oldest').default('newest')
});

const adminNewsQuery = newsQuery.keys({
    status:joi.string().valid('PENDING', 'PUBLISHED', 'REJECTED'),
})

const category = joi.object({
    name:joi.string().min(2).max(50),
    description:joi.string().max(300),
})

const tag = joi.object({
    name:joi.string().min(2).max(30)
})

const rejectNews = joi.object({
    reason:joi.string().min(3).max(300)
})

const blockUser = joi.object({
    reason:joi.string().min(3).max(300)
})