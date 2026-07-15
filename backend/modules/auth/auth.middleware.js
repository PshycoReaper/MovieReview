const AppError = require("../../utils/app-error.util");
const { verifyAuthToken } = require("../../utils/jwt.util");

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return next(new AppError(401, { mensaje: "Token no proporcionado." }));
    }

    try {
        req.admin = verifyAuthToken(token);
        return next();
    } catch (error) {
        return next(new AppError(401, { mensaje: "Token inválido o expirado." }));
    }
}

module.exports = { requireAuth };
