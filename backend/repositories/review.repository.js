const Review = require("../models/Review");


const findReviews = (filter = {}) => Review.find(filter).sort({ createdAt: -1 });

const findReviewsByMovieId = (movieId) =>
    Review.find({ idMovie: movieId }).sort({ createdAt: -1 });

const findReviewById = (id) => Review.findById(id);

const createReview = (reviewData) => Review.create(reviewData);

const updateReviewById = (id, updates) =>
    Review.findByIdAndUpdate(id, updates, { new: true, runValidators: true, context: "query" });

const deleteReviewById = (id) => Review.findByIdAndDelete(id);

module.exports = {
    findReviews,
    findReviewsByMovieId,
    findReviewById,
    createReview,
    updateReviewById,
    deleteReviewById
};
