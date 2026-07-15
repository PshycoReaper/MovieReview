require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const readline = require("readline");

const adminRepository = require("./repositories/admin.repository");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(text) {
    return new Promise(resolve => {
        rl.question(text, answer => resolve(answer.trim()));
    });
}

async function createAdministrator() {

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("\n=====================================");
        console.log(" FilmTalk - Administrador");
        console.log("=====================================\n");

        const totalAdmins = await adminRepository.countAdmins();

        if (totalAdmins === 0) {

            console.log("No existen administradores registrados.");
            console.log("Se creará el administrador principal.\n");

        } else {

            console.log(`Administradores registrados: ${totalAdmins}\n`);

        }

        const userName = await question("Nombre de usuario: ");

        const email = await question("Correo electrónico: ");

        const password = await question("Contraseña: ");

        const existingEmail = await adminRepository.findAdminByEmail(email);

        if (existingEmail) {

            console.log("\n Ya existe un administrador con ese correo.");
            rl.close();
            process.exit();

        }

        const existingUser = await adminRepository.findAdminByUserName(userName);

        if (existingUser) {

            console.log("\n Ese nombre de usuario ya existe.");
            rl.close();
            process.exit();

        }

        const passwordHash = await bcrypt.hash(password, 10);

        await adminRepository.createAdmin({

            userName,
            email,
            password: passwordHash

        });

        console.log("\n Administrador creado correctamente.");

        rl.close();
        process.exit();

    }
    catch (error) {

        console.error("\n Error:", error.message);

        rl.close();
        process.exit(1);

    }

}

createAdministrator();