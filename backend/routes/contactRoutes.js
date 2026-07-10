const express = require("express");
const router = express.Router();

const {
    postContactRequest,
    getContactRequests,
    getContactRequestById,
    updateContactRequest,
    deleteContactRequest
} = require("../controllers/contactController");

// Rutas para peticiones de contacto (cambios de review / solicitud de películas)
router.post("/postContactRequest", postContactRequest);
router.get("/getContactRequests", getContactRequests); // admite ?status= y ?requestType=
router.get("/getContactRequest/:id", getContactRequestById);
router.put("/updateContactRequest/:id", updateContactRequest);
router.delete("/deleteContactRequest/:id", deleteContactRequest);

module.exports = router;
