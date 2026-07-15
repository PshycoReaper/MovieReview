const bcrypt = require("bcrypt");

const AppError = require("../../utils/app-error.util");
const { signAuthToken } = require("../../utils/jwt.util");
const adminRepository = require("../../repositories/admin.repository");
const { validateLoginPayload } = require("./auth.validator");

const INVALID_CREDENTIALS_MESSAGE = "Correo o contraseña incorrectos.";

function buildLoginSuccessResponse(admin, token) {
    return {
        mensaje: "Inicio de sesión exitoso.",
        token,
        admin: {
            id: admin._id,
            userName: admin.userName,
            email: admin.email
        }
    };
}

async function passwordMatches(rawPassword, hashedPassword) {
    return bcrypt.compare(rawPassword, hashedPassword);
}

async function findAuthenticatedAdmin(email, password) {
    const admin = await adminRepository.findAdminByEmail(email);

    if (!admin) {
        throw new AppError(401, { mensaje: INVALID_CREDENTIALS_MESSAGE });
    }

    const isValidPassword = await passwordMatches(password, admin.password);

    if (!isValidPassword) {
        throw new AppError(401, { mensaje: INVALID_CREDENTIALS_MESSAGE });
    }

    return admin;
}

async function authenticateAdmin(credentials) {
    try {
        const { valid, email, password } = validateLoginPayload(credentials);

        if (!valid) {
            throw new AppError(400, { mensaje: "Correo y contraseña son obligatorios." });
        }

        const admin = await findAuthenticatedAdmin(email, password);

        const token = signAuthToken({
            id: admin._id,
            userName: admin.userName
        });

        return buildLoginSuccessResponse(admin, token);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(500, {
            mensaje: "Error interno del servidor.",
            error: error.message
        });
    }
}

module.exports = {
    authenticateAdmin
};
