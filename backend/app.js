const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const moviesRoutes = require("./routes/moviesRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/movies", moviesRoutes)
app.use("/api/contact", contactRoutes)


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("API MovieReview funcionando correctamente");
});

module.exports = app;