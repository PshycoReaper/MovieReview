const express = require("express");
const router = express.Router();

const asyncHandler = require("../../utils/async-handler.util");
const movieService = require("./movie.service");

router.post(
    "/postMovie",
    asyncHandler(async (req, res) => {
        const savedMovie = await movieService.registerMovie(req.body);
        res.status(201).json(savedMovie);
    })
);

router.get(
    "/getMovies",
    asyncHandler(async (req, res) => {
        const movies = await movieService.listMoviesWithStats();
        res.status(200).json(movies);
    })
);

router.get(
    "/getMovieByName/:name",
    asyncHandler(async (req, res) => {
        const moviesFound = await movieService.searchMoviesByTitle(req.params.name);
        res.status(200).json(moviesFound);
    })
);

router.get(
    "/getMovie/:id",
    asyncHandler(async (req, res) => {
        const movie = await movieService.getMovieDetail(req.params.id);
        res.status(200).json(movie);
    })
);

router.put(
    "/updateMovie/:id",
    asyncHandler(async (req, res) => {
        const result = await movieService.updateMovie(req.params.id, req.body);
        res.status(200).json(result);
    })
);

router.delete(
    "/deleteMovie/:id",
    asyncHandler(async (req, res) => {
        const result = await movieService.removeMovie(req.params.id);
        res.status(200).json(result);
    })
);

module.exports = router;
