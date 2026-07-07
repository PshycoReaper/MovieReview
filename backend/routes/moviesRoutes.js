const express = require("express");
const router = express.Router();

const {postMovie, deleteMovie} = require("../controllers/moviesController.js")
const {getMovies} = require("../controllers/moviesController.js")
const {updateMovie} = require("../controllers/moviesController.js")
 
router.post("/postMovie", postMovie)
router.get("/getMovies", getMovies)
router.put("/updateMovie/:id", updateMovie)
router.delete("/deleteMovie/:id", deleteMovie)

module.exports = router