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

module.exports ={
    postMovie, getMovies
}