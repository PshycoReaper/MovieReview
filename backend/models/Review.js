const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        idMovie: {
            type: Number,
            required: true
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        review: {
            type: String,
            required: true
        },
        grade: {
            type: Number,
            required: true
        }

    },
    {
        timestamps: true
    });

module.exports = mongoose.model("reviews", reviewSchema);