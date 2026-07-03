const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
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