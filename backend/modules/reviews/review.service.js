const AppError = require("../../utils/app-error.util");
const { isValidObjectId } = require("../../utils/validation.util");
const reviewRepository = require("../../repositories/review.repository");
const movieRepository = require("../../repositories/movie.repository");


async function submitReview(payload) {
    const { idMovie } = payload || {};

    if (!idMovie || !isValidObjectId(idMovie)) {
        throw new AppError(400, {
            message: "idMovie es requerido y debe ser un ID de película válido"
        });
    }

    try {
        const movieExists = await movieRepository.findMovieById(idMovie);

        if (!movieExists) {
            throw new AppError(404, { message: "La película indicada no existe" });
        }

        return await reviewRepository.createReview(payload);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al guardar la reseña" });
    }
}


async function listReviews(query) {
    const { idMovie } = query || {};
    const filter = {};

    if (idMovie) {
        if (!isValidObjectId(idMovie)) {
            throw new AppError(400, { message: "idMovie inválido" });
        }
        filter.idMovie = idMovie;
    }

    try {
        return await reviewRepository.findReviews(filter);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al obtener las reseñas" });
    }
}


async function listReviewsForMovie(movieId) {
    if (!isValidObjectId(movieId)) {
        throw new AppError(400, { message: "ID de película inválido" });
    }

    try {
        return await reviewRepository.findReviewsByMovieId(movieId);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al obtener las reseñas de la película" });
    }
}


async function getReviewDetail(id) {
    try {
        const foundReview = await reviewRepository.findReviewById(id);

        if (!foundReview) {
            throw new AppError(404, { message: "Reseña no encontrada" });
        }

        return foundReview;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al obtener la reseña" });
    }
}


async function removeReview(id) {
    try {
        const deletedReview = await reviewRepository.deleteReviewById(id);

        if (!deletedReview) {
            throw new AppError(404, { message: "Reseña no encontrada" });
        }

        return { message: "Reseña eliminada exitosamente", deletedReview };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al eliminar la reseña" });
    }
}


async function updateReview(id, updates) {
    try {
        const updatedReview = await reviewRepository.updateReviewById(id, updates);

        if (!updatedReview) {
            throw new AppError(404, { message: "Reseña no encontrada" });
        }

        return { message: "Reseña actualizada exitosamente", review: updatedReview };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        if (error.name === "CastError") {
            throw new AppError(400, { message: "ID de reseña inválido" });
        }

        if (error.name === "ValidationError") {
            throw new AppError(400, { message: "Error de validación", errors: error.errors });
        }

        throw new AppError(500, { message: "Error al actualizar la reseña", error: error.message });
    }
}

module.exports = {
    submitReview,
    listReviews,
    listReviewsForMovie,
    getReviewDetail,
    removeReview,
    updateReview
};
