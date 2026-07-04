const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    overview: {
        type: String,
        required: true
    },

    poster: {
        type: String,
        required: true
    },

    backdrop: {
        type: String,
        required: true
    },

    releaseDate: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },

    genres: {
        type: Array,
        required: true
    },

    language: {
        type: String,
        required: true
    },
})


module.exports = mongoose.model("movies", movieSchema);