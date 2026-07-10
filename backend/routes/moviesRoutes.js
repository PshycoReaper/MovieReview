const express = require("express");
const router = express.Router();

const {postMovie, deleteMovie, getMovieByName} = require("../controllers/moviesController.js")
const {getMovies} = require("../controllers/moviesController.js")
const {getMovieById} = require("../controllers/moviesController.js")
const {updateMovie} = require("../controllers/moviesController.js")
 
router.post("/postMovie", postMovie)
router.get("/getMovies", getMovies)
router.get("/getMovie/:id", getMovieById)
router.get("/getMovieByName/:name", getMovieByName)
router.put("/updateMovie/:id", updateMovie)
router.delete("/deleteMovie/:id", deleteMovie)

module.exports = router