const movie = require("../models/Movie")

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
        //console.log(movies)
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error al obtener las reseñas:", error);
        res.status(500).json({ message: "Error al obtener las reseñas" });
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

module.exports = {
    postMovie,
    getMovies,
    updateMovie,
    deleteMovie
}