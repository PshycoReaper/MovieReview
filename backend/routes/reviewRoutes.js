const express = require("express");
const router = express.Router();

const { postReview } = require("../controllers/reviewController");
const {getReviews} = require("../controllers/reviewController");

router.post("/postReview", postReview);
router.get("/getReviews", getReviews);


module.exports = router;