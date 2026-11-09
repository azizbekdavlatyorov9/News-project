
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Foydalanuvchi nomi kiritilishi shart"],
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Foydalanuvchi emaili kiritilishi shart"],
        unique: true,
        lowercase: true,
        trim: true
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
        default: null
    },
    blockedAt: {
        type: Date,
        default: null
    },
    blockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User"
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema);