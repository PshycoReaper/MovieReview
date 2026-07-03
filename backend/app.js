const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/movies", reviewRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("API MovieReview funcionando correctamente");
});

module.exports = app;