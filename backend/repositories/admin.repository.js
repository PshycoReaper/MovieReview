const Admin = require("../models/Admin");

async function findAdminByEmail(email) {
    return await Admin.findOne({ email });
}

async function findAdminByUserName(userName) {
    return await Admin.findOne({ userName });
}

async function createAdmin(adminData) {
    return await Admin.create(adminData);
}

async function countAdmins() {
    return await Admin.countDocuments();
}

module.exports = {
    findAdminByEmail,
    findAdminByUserName,
    createAdmin,
    countAdmins
};