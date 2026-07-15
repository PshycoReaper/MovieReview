const mongoose = require("mongoose");
const review = require("../models/Review");
const movie = require("../models/Movie");

const postReview = async (req, res) => {
    try {
        console.log("\n========== POST REVIEW ==========");
        console.log("Body recibido:", req.body);

        const { idMovie } = req.body;

        if (!idMovie || !mongoose.Types.ObjectId.isValid(idMovie)) {
            return res.status(400).json({ message: "idMovie es requerido y debe ser un ID de película válido" });
        }

        // Verificar que la película exista antes de guardar la reseña
        const movieExists = await movie.findById(idMovie);
        if (!movieExists) {
            return res.status(404).json({ message: "La película indicada no existe" });
        }

        const newReview = new review(req.body);
        console.log("Lo que se va a guardar en la base de datos:", newReview);

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error al guardar la reseña:", error);
        res.status(500).json({ message: "Error al guardar la reseña" });
    }
};

const getReviews = async (req, res) => {
    try {
        // Permite filtrar por película con ?idMovie=<id>
        const { idMovie } = req.query;
        const filter = {};

        if (idMovie) {
            if (!mongoose.Types.ObjectId.isValid(idMovie)) {
                return res.status(400).json({ message: "idMovie inválido" });
            }
            filter.idMovie = idMovie;
        }

        const reviews = await review.find(filter).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error al obtener las reseñas:", error);
        res.status(500).json({ message: "Error al obtener las reseñas" });
    }
};

const getReviewsByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: "ID de película inválido" });
        }

        const reviews = await review
            .find({ idMovie: movieId })
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error al obtener las reseñas de la película:", error);
        res.status(500).json({ message: "Error al obtener las reseñas de la película" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const deletedReview = await review.findByIdAndDelete(reviewId);
        
        if (!deletedReview) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        
        res.status(200).json({ 
            message: "Reseña eliminada exitosamente", 
            deletedReview 
        });
    } catch (error) {
        console.error("Error al eliminar la reseña:", error);
        res.status(500).json({ message: "Error al eliminar la reseña" });
    }
};

// ============================================
// UPDATE REVIEW - CORREGIDO
// ============================================
const updateReview = async (req, res) => {
    try {
        console.log("\n========== UPDATE REVIEW ==========");
        const reviewId = req.params.id;
        console.log("ID de la reseña a actualizar:", reviewId);
        console.log("Datos recibidos para actualizar:", req.body);

        // Verificar que el ID sea válido
        if (!reviewId) {
            return res.status(400).json({ 
                message: "ID de reseña no proporcionado" 
            });
        }

        // Opciones para findByIdAndUpdate
        const options = {
            new: true,           // Retorna el documento actualizado
            runValidators: true, // Ejecuta las validaciones del schema
            context: 'query'     // Contexto para las validaciones
        };

        // Actualizar la reseña
        const updatedReview = await review.findByIdAndUpdate(
            reviewId, 
            req.body, 
            options
        );

        // Verificar si la reseña existe
        if (!updatedReview) {
            console.log("Reseña no encontrada con ID:", reviewId);
            return res.status(404).json({ 
                message: "Reseña no encontrada" 
            });
        }

        console.log("Reseña actualizada exitosamente:", updatedReview);
        res.status(200).json({
            message: "Reseña actualizada exitosamente",
            review: updatedReview
        });

    } catch (error) {
        console.error("Error al actualizar la reseña:", error);
        
        // Manejar errores específicos de MongoDB
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: "ID de reseña inválido" 
            });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Error de validación", 
                errors: error.errors 
            });
        }

        res.status(500).json({ 
            message: "Error al actualizar la reseña",
            error: error.message 
        });
    }
};

// ============================================
// FUNCIÓN ADICIONAL: Obtener una reseña específica
// ============================================
const getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const foundReview = await review.findById(reviewId);
        
        if (!foundReview) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        
        res.status(200).json(foundReview);
    } catch (error) {
        console.error("Error al obtener la reseña:", error);
        res.status(500).json({ message: "Error al obtener la reseña" });
    }
};

module.exports = { 
    postReview, 
    getReviews, 
    getReviewsByMovie,
    deleteReview, 
    updateReview,
    getReviewById  // Exportar la nueva función
};