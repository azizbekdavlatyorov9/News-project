const { ObjectId } = require("mongodb");

const mongoose = rqeuire("mongoose");

const userSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: [true, "Foydalanuvchi nomi kiritilishi shart"],
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Foydalanuvchi emaili kiritilishi shart"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Foydalanuvchi paroli kiritilishi shart"],
        minlength: [6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"],
    },
    role: {
        type: String,
        default: "USER",
        enum: ["USER", "ADMIN"],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockReason: {
        type: String,
        maxlength: 300,
        required: [true, "Bloklangan sabab kiritilishi shart"]
    },
    blockedAt: {
        type: Date,
        default: null
    },
    blockedBy: {
        type: ObjectId,
        default: null
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        timestamps: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        timestamps: true
    }
})