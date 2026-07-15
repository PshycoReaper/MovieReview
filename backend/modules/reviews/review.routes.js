const express = require("express");
const router = express.Router();

const asyncHandler = require("../../utils/async-handler.util");
const reviewService = require("./review.service");

router.post(
    "/postReview",
    asyncHandler(async (req, res) => {
        const savedReview = await reviewService.submitReview(req.body);
        res.status(201).json(savedReview);
    })
);

router.get(
    "/getReviews",
    asyncHandler(async (req, res) => {
        const reviews = await reviewService.listReviews(req.query);
        res.status(200).json(reviews);
    })
);

router.get(
    "/getReviewsByMovie/:movieId",
    asyncHandler(async (req, res) => {
        const reviews = await reviewService.listReviewsForMovie(req.params.movieId);
        res.status(200).json(reviews);
    })
);

router.get(
    "/getReview/:id",
    asyncHandler(async (req, res) => {
        const foundReview = await reviewService.getReviewDetail(req.params.id);
        res.status(200).json(foundReview);
    })
);

router.delete(
    "/deleteReview/:id",
    asyncHandler(async (req, res) => {
        const result = await reviewService.removeReview(req.params.id);
        res.status(200).json(result);
    })
);

router.put(
    "/updateReview/:id",
    asyncHandler(async (req, res) => {
        const result = await reviewService.updateReview(req.params.id, req.body);
        res.status(200).json(result);
    })
);

module.exports = router;
