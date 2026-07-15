const AppError = require("../../utils/app-error.util");
const contactRepository = require("../../repositories/contact.repository");

const VALID_REQUEST_TYPES = ["review_change", "movie_request"];

function assertValidContactPayload(body = {}) {
    const { requestType, fullName, email, message } = body;

    if (!requestType || !VALID_REQUEST_TYPES.includes(requestType)) {
        throw new AppError(400, {
            message: "requestType es requerido y debe ser 'review_change' o 'movie_request'"
        });
    }

    if (!fullName || !email || !message) {
        throw new AppError(400, { message: "Nombre, correo y mensaje son obligatorios." });
    }
}


async function submitContactRequest(payload) {
    assertValidContactPayload(payload);

    try {
        return await contactRepository.createContactRequest(payload);
    } catch (error) {
        if (error.name === "ValidationError") {
            throw new AppError(400, { message: "Error de validación", errors: error.errors });
        }
        throw new AppError(500, { message: "Error al guardar la petición" });
    }
}


async function listContactRequests(query) {
    const { status, requestType } = query || {};
    const filter = {};

    if (status) filter.status = status;
    if (requestType) filter.requestType = requestType;

    try {
        return await contactRepository.findContactRequests(filter);
    } catch (error) {
        throw new AppError(500, { message: "Error al obtener las peticiones" });
    }
}


async function getContactRequestDetail(id) {
    try {
        const request = await contactRepository.findContactRequestById(id);

        if (!request) {
            throw new AppError(404, { message: "Petición no encontrada" });
        }

        return request;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        if (error.name === "CastError") {
            throw new AppError(400, { message: "ID de petición inválido" });
        }

        throw new AppError(500, { message: "Error al obtener la petición" });
    }
}


async function updateContactRequest(id, updates) {
    try {
        const updatedRequest = await contactRepository.updateContactRequestById(id, updates);

        if (!updatedRequest) {
            throw new AppError(404, { message: "Petición no encontrada" });
        }

        return { message: "Petición actualizada exitosamente", request: updatedRequest };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        if (error.name === "CastError") {
            throw new AppError(400, { message: "ID de petición inválido" });
        }

        if (error.name === "ValidationError") {
            throw new AppError(400, { message: "Error de validación", errors: error.errors });
        }

        throw new AppError(500, { message: "Error al actualizar la petición" });
    }
}


async function removeContactRequest(id) {
    try {
        const deletedRequest = await contactRepository.deleteContactRequestById(id);

        if (!deletedRequest) {
            throw new AppError(404, { message: "Petición no encontrada" });
        }

        return { message: "Petición eliminada exitosamente", deletedRequest };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, { message: "Error al eliminar la petición" });
    }
}

module.exports = {
    submitContactRequest,
    listContactRequests,
    getContactRequestDetail,
    updateContactRequest,
    removeContactRequest
};
