const mongoose = require("mongoose");

const Movie = require("../models/Movie");
const Review = require("../models/Review");


const findAllMovies = () => Movie.find().sort({ createdAt: -1 });

const findMovieById = (id) => Movie.findById(id);

const findMoviesByTitleRegex = (name) =>
    Movie.find({ title: { $regex: name, $options: "i" } }).sort({ createdAt: -1 });

const createMovie = (movieData) => Movie.create(movieData);

const updateMovieById = (id, updates) =>
    Movie.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

const deleteMovieById = (id) => Movie.findByIdAndDelete(id);


const getReviewStatsGroupedByMovie = () =>
    Review.aggregate([
        { $group: { _id: "$idMovie", count: { $sum: 1 }, avgGrade: { $avg: "$grade" } } }
    ]);


const getReviewStatsForMovie = (movieId) =>
    Review.aggregate([
        { $match: { idMovie: new mongoose.Types.ObjectId(movieId) } },
        { $group: { _id: "$idMovie", count: { $sum: 1 }, avgGrade: { $avg: "$grade" } } }
    ]);

module.exports = {
    findAllMovies,
    findMovieById,
    findMoviesByTitleRegex,
    createMovie,
    updateMovieById,
    deleteMovieById,
    getReviewStatsGroupedByMovie,
    getReviewStatsForMovie
};
