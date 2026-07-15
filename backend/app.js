const express = require("express");
const cors = require("cors");

const registerRoutes = require("./config/routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "25mb"
}));

// Registro centralizado de rutas
registerRoutes(app);

// Manejo global de errores (siempre al final, después de las rutas)
app.use(errorHandler);

module.exports = app;
