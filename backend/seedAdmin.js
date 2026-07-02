require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require("./models/Admin");

async function seedAdmin() {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB");

        // Verificar si ya existe un administrador
        const existeAdmin = await Admin.findOne({ email: "admin@moviereview.com" });

        if (existeAdmin) {
            console.log("El administrador ya existe.");
            process.exit();
        }

        // Encriptar contraseña
        const passwordHash = await bcrypt.hash("Admin123*", 10);

        // Crear administrador
        const admin = new Admin({
            userName: "admin",
            email: "admin@moviereview.com",
            password: passwordHash
        });

        await admin.save();

        console.log("Administrador creado correctamente.");
        // console.log("Correo: admin@moviereview.com");
        // console.log("Contraseña: Admin123*");

        process.exit();

    } catch (error) {

        console.error("Error:", error.message);
        process.exit(1);

    }
}

seedAdmin();