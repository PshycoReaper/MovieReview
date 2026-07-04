const express = require("express");
const router = express.Router();

const { postReview } = require("../controllers/reviewController");
const { getReviews } = require("../controllers/reviewController");
const { deleteReview } = require("../controllers/reviewController");

router.post("/postReview", postReview);
router.get("/getReviews", getReviews);
router.delete("/deleteReview/:id", deleteReview);


module.exports = router;