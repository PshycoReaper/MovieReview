const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {

        console.log("\n========== LOGIN ==========");
        console.log("Body recibido:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Correo y contraseña son obligatorios."
            });
        }

        console.log("Buscando administrador...");

        const admin = await Admin.findOne({ email });

        console.log("Administrador encontrado:", admin);

        if (!admin) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        console.log("Comparando contraseña...");

        const passwordCorrecta = await bcrypt.compare(password, admin.password);

        console.log("¿Contraseña correcta?:", passwordCorrecta);

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const token = jwt.sign(
            {
                id: admin._id,
                userName: admin.userName
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        console.log("Token generado correctamente.");

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso.",
            token,
            admin: {
                id: admin._id,
                userName: admin.userName,
                email: admin.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor.",
            error: error.message
        });

    }
};

module.exports = {
    login
};