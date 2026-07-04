const express = require("express");
const router = express.Router();

const {postMovie} = require("../controllers/moviesController.js")
const {getMovies} = require("../controllers/moviesController.js")
 
router.post("/postMovie", postMovie)
router.get("/getMovies", getMovies)

module.exports = router