const { required } = require("joi");
const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Sarlavha kiritilishi shart"],
        trim: true,
        minLength: 5,
        maxLength: 200
    },
    description: {
        type: String,
        required: [true, "Yangilikning to'liq matni kiritilishi shart"],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true
    },
    images: [{
        url: { type: String, required: true },
        filename: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true }
    }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tags: {
        type: mongoose.Schema.ObjectId,
        ref: "Tag",
        required: true
    },
    status: {
        type: String,
        default: PENDING,
        enum: {
            values: [PENDING | PUBLISHED | REJECTED]
        }
    },
    rejectReason: {
        type: String,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviewedAt: {
        type: Date
    },
    publishedAt: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("News", newsSchema);