const authRoutes = require("../modules/auth/auth.routes");
const movieRoutes = require("../modules/movies/movie.routes");
const reviewRoutes = require("../modules/reviews/review.routes");
const contactRoutes = require("../modules/contact/contact.routes");

/**
 * Registra todas las rutas de la aplicación en una única función,
 * para que app.js no tenga que hacer múltiples app.use(...) sueltos.
 */
function registerRoutes(app) {
    app.get("/", (req, res) => {
        res.send("API MovieReview funcionando correctamente");
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/reviews", reviewRoutes);
    app.use("/api/movies", movieRoutes);
    app.use("/api/contact", contactRoutes);
}

module.exports = registerRoutes;
