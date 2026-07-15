const express = require("express");
const router = express.Router();

const { 
    postReview, 
    getReviews, 
    getReviewsByMovie,
    deleteReview, 
    updateReview,
    getReviewById 
} = require("../controllers/reviewController");

// Rutas para reseñas
router.post("/postReview", postReview);
router.get("/getReviews", getReviews); // admite ?idMovie=<id> para filtrar
router.get("/getReviewsByMovie/:movieId", getReviewsByMovie); // reseñas de una película específica
router.get("/getReview/:id", getReviewById);  // Nueva ruta para obtener una reseña específica
router.delete("/deleteReview/:id", deleteReview);
router.put("/updateReview/:id", updateReview);  // Usamos PUT para actualización completa

// También podríamos usar PATCH para actualización parcial
// router.patch("/updateReview/:id", updateReview);

module.exports = router;