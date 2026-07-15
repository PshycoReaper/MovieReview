const AppError = require("../utils/app-error.util");

/*
 Middleware global de errores.
 
  - Si el error es un AppError (lanzado intencionalmente por un service),
    responde exactamente con el statusCode y el body que definió el service,
    preservando el contrato original de cada endpoint.
  - Si es un error no controlado (bug, fallo de conexión, etc.), responde
    un 500 genérico y lo deja registrado en consola, igual que hacían
    los catch originales por defecto.
 
  Debe registrarse DESPUÉS de todas las rutas (app.use(errorHandler)).
 */
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json(err.body);
    }

    console.error(err);

    return res.status(500).json({
        message: "Error interno del servidor",
        error: err.message
    });
}

module.exports = errorHandler;
