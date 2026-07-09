const ContactRequest = require("../models/ContactRequest");

// ============================================
// Crear una nueva petición (formulario público)
// ============================================
const postContactRequest = async (req, res) => {
    try {
        console.log("\n========== POST CONTACT REQUEST ==========");
        console.log("Body recibido:", req.body);

        const { requestType, fullName, email, message } = req.body;

        if (!requestType || !["review_change", "movie_request"].includes(requestType)) {
            return res.status(400).json({
                message: "requestType es requerido y debe ser 'review_change' o 'movie_request'"
            });
        }

        if (!fullName || !email || !message) {
            return res.status(400).json({
                message: "Nombre, correo y mensaje son obligatorios."
            });
        }

        const newRequest = new ContactRequest(req.body);
        const savedRequest = await newRequest.save();

        res.status(201).json(savedRequest);
    } catch (error) {
        console.error("Error al guardar la petición:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Error de validación",
                errors: error.errors
            });
        }

        res.status(500).json({ message: "Error al guardar la petición" });
    }
};

// ============================================
// Obtener todas las peticiones (admin)
// Admite filtros opcionales: ?status=pending&requestType=movie_request
// ============================================
const getContactRequests = async (req, res) => {
    try {
        const { status, requestType } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (requestType) filter.requestType = requestType;

        const requests = await ContactRequest.find(filter).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error al obtener las peticiones:", error);
        res.status(500).json({ message: "Error al obtener las peticiones" });
    }
};

// ============================================
// Obtener una petición específica
// ============================================
const getContactRequestById = async (req, res) => {
    try {
        const request = await ContactRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Petición no encontrada" });
        }

        res.status(200).json(request);
    } catch (error) {
        console.error("Error al obtener la petición:", error);

        if (error.name === "CastError") {
            return res.status(400).json({ message: "ID de petición inválido" });
        }

        res.status(500).json({ message: "Error al obtener la petición" });
    }
};

// ============================================
// Actualizar una petición (admin: status / adminNotes principalmente)
// ============================================
const updateContactRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        const options = {
            new: true,
            runValidators: true,
            context: "query"
        };

        const updatedRequest = await ContactRequest.findByIdAndUpdate(requestId, req.body, options);

        if (!updatedRequest) {
            return res.status(404).json({ message: "Petición no encontrada" });
        }

        res.status(200).json({
            message: "Petición actualizada exitosamente",
            request: updatedRequest
        });
    } catch (error) {
        console.error("Error al actualizar la petición:", error);

        if (error.name === "CastError") {
            return res.status(400).json({ message: "ID de petición inválido" });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Error de validación",
                errors: error.errors
            });
        }

        res.status(500).json({ message: "Error al actualizar la petición" });
    }
};

// ============================================
// Eliminar una petición
// ============================================
const deleteContactRequest = async (req, res) => {
    try {
        const deletedRequest = await ContactRequest.findByIdAndDelete(req.params.id);

        if (!deletedRequest) {
            return res.status(404).json({ message: "Petición no encontrada" });
        }

        res.status(200).json({
            message: "Petición eliminada exitosamente",
            deletedRequest
        });
    } catch (error) {
        console.error("Error al eliminar la petición:", error);
        res.status(500).json({ message: "Error al eliminar la petición" });
    }
};

module.exports = {
    postContactRequest,
    getContactRequests,
    getContactRequestById,
    updateContactRequest,
    deleteContactRequest
};
