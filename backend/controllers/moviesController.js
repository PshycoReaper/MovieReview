const mongoose = require("mongoose");
const movie = require("../models/Movie")
const review = require("../models/Review")

const postMovie = async (req, res) => {
    try {
        console.log("\n========== POST Movie ==========");
        console.log("Body recibido:", req.body);
        const newMovie = new movie(req.body);
        console.log("Lo que se va a guardar en la base de datos:", newMovie)


        const savedMovie = await newMovie.save();

        res.status(201).json(savedMovie);
    } catch (error) {
        console.error("Error al guardar la reseña:", error);
        res.status(500).json({ message: "Error al guardar la reseña" });
    }
}

const getMovies= async (req, res) => {
    try {
        const movies = await movie.find().sort({ createdAt: -1 });

        // Contar cuántas reseñas tiene cada película y agregarlo como campo "reviewsCount"
        const reviewCounts = await review.aggregate([
            { $group: { _id: "$idMovie", count: { $sum: 1 } } }
        ]);

        const countsMap = reviewCounts.reduce((acc, item) => {
            acc[item._id.toString()] = item.count;
            return acc;
        }, {});

        const moviesWithCounts = movies.map((m) => ({
            ...m.toObject(),
            reviewsCount: countsMap[m._id.toString()] || 0
        }));

        res.status(200).json(moviesWithCounts);
    } catch (error) {
        console.error("Error al obtener las películas:", error);
        res.status(500).json({ message: "Error al obtener las películas" });
    }
};

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de película inválido" });
        }

        const foundMovie = await movie.findById(id);

        if (!foundMovie) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        const reviewsCount = await review.countDocuments({ idMovie: id });

        res.status(200).json({ ...foundMovie.toObject(), reviewsCount });
    } catch (error) {
        console.error("Error al obtener la película:", error);
        res.status(500).json({ message: "Error al obtener la película" });
    }
};


const updateMovie = async (req, res) => {
    try {
        console.log("\n========== UPDATE Movie ==========");

        const {
            id
        } = req.params;

        console.log("ID:", id);

        console.log("Body recibido:", req.body);

        const updatedMovie = await movie.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedMovie) {
            return res.status(404).json({
                message: "Película no encontrada"
            });
        }

        console.log("Película actualizada exitosamente:", updatedMovie);

        res.status(200).json({
            message: "Película actualizada exitosamente",
            movieUpdated: updatedMovie
        });

        // res.status(200).json(updatedMovie);


    } catch {
        console.error(error);

        res.status(500).json({
            message: "Error al actualizar la película"
        });
    }
}

const deleteMovie = async (req, res) => {
    try {
        const deletedMovieId = req.params.id;
        const deletedMovie = await movie.findByIdAndDelete(deletedMovieId);

        if (!deletedMovie) {
            return res.status(404).json({
                message: "Película no encontrada"
            });
        }

        res.status(200).json({
            message: "Película eliminada exitosamente",
            deletedMovie
        });

    } catch (error) {
        console.error("Error al eliminar películas:", error);
        res.status(500).json({
            message: "Error al eliminar película"
        });
    }
}

// Búsqueda de películas por título (usado por la barra de búsqueda de "Explorar películas")
const getMovieByName = async (req, res) => {
    try {
        const { name } = req.params;

        const moviesFound = await movie.find({
            title: { $regex: name, $options: "i" }
        }).sort({ createdAt: -1 });

        res.status(200).json(moviesFound);
    } catch (error) {
        console.error("Error al buscar películas:", error);
        res.status(500).json({
            message: "Error al buscar películas"
        });
    }
}

module.exports = {
    postMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
    getMovieByName
}