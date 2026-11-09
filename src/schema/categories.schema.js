const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Kategoriya nomi kiritilishi shart"],
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 300,
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Category", categoriesSchema);