const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 2,
        maxLength: 30,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    }
})

module.exports = mongoose.model("Tag", tagSchema);