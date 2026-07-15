const AppError = require("../../utils/app-error.util");
const { isValidObjectId } = require("../../utils/validation.util");
const movieRepository = require("../../repositories/movie.repository");


function buildStatsMapById(reviewStats) {
    return reviewStats.reduce((statsMap, stat) => {
        statsMap[stat._id.toString()] = {
            count: stat.count,
            avgGrade: stat.avgGrade
        };
        return statsMap;
    }, {});
}


function attachReviewStats(movieDoc, stats) {
    return {
        ...movieDoc.toObject(),
        reviewsCount: stats ? stats.count : 0,
        communityRating: stats ? Number(stats.avgGrade.toFixed(1)) : null
    };
}


async function listMoviesWithStats() {
    try {
        const movies = await movieRepository.findAllMovies();
        const reviewStats = await movieRepository.getReviewStatsGroupedByMovie();
        const statsMap = buildStatsMapById(reviewStats);

        return movies.map((movieDoc) => attachReviewStats(movieDoc, statsMap[movieDoc._id.toString()]));
    } catch (error) {
        throw new AppError(500, { message: "Error al obtener las películas" });
    }
}


async function getMovieDetail(id) {
    if (!isValidObjectId(id)) {
        throw new AppError(400, { message: "ID de película inválido" });
    }

    try {
        const foundMovie = await movieRepository.findMovieById(id);

        if (!foundMovie) {
            throw new AppError(404, { message: "Película no encontrada" });
        }

        const [stats] = await movieRepository.getReviewStatsForMovie(id);

        return attachReviewStats(foundMovie, stats);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al obtener la película" });
    }
}


async function searchMoviesByTitle(name) {
    try {
        return await movieRepository.findMoviesByTitleRegex(name);
    } catch (error) {
        throw new AppError(500, { message: "Error al buscar películas" });
    }
}


async function registerMovie(payload) {
    try {
        return await movieRepository.createMovie(payload);
    } catch (error) {
        throw new AppError(500, { message: "Error al guardar la película" });
    }
}


async function updateMovie(id, updates) {
    try {
        const updatedMovie = await movieRepository.updateMovieById(id, updates);

        if (!updatedMovie) {
            throw new AppError(404, { message: "Película no encontrada" });
        }

        return {
            message: "Película actualizada exitosamente",
            movieUpdated: updatedMovie
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al actualizar la película" });
    }
}


async function removeMovie(id) {
    try {
        const deletedMovie = await movieRepository.deleteMovieById(id);

        if (!deletedMovie) {
            throw new AppError(404, { message: "Película no encontrada" });
        }

        return {
            message: "Película eliminada exitosamente",
            deletedMovie
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al eliminar película" });
    }
}

module.exports = {
    listMoviesWithStats,
    getMovieDetail,
    searchMoviesByTitle,
    registerMovie,
    updateMovie,
    removeMovie
};
