const review = require("../models/Review");

const postReview = async (req, res) => {
    try {
        console.log("\n========== POST REVIEW ==========");
        console.log("Body recibido:", req.body);
        const newReview = new review(req.body);
        console.log("Lo que se va a guardar en la base de datos:", newReview);


        // Generar un ID aleatorio para la reseña 
        newReview.id = Math.floor(Math.random() * 1000000);
        // Generar un ID aleatorio TEMPORAL para la pelicula
        newReview.idMovie = Math.floor(Math.random() * 1000000);
         // Convertir a número decimal

        const savedReview = await newReview.save();

        res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error al guardar la reseña:", error);
        res.status(500).json({ message: "Error al guardar la reseña" });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await review.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error al obtener las reseñas:", error);
        res.status(500).json({ message: "Error al obtener las reseñas" });
    }
};

module.exports = { postReview, getReviews };