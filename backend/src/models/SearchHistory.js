const mongoose = require("mongoose");

const searchHistorySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    keyword: {
        type: String,
        required: true,
        trim: true
    },

    source: {
        type: String,
        default: "youtube"
    },

    videoTitle: {
        type: String,
        default: ""
    },

    totalPosts: {
        type: Number,
        default: 0
    },

    positive: {
        type: Number,
        default: 0
    },

    negative: {
        type: Number,
        default: 0
    },

    neutral: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

module.exports = { SearchHistory };