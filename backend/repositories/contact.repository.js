const ContactRequest = require("../models/ContactRequest");


const findContactRequests = (filter = {}) =>
    ContactRequest.find(filter).sort({ createdAt: -1 });

const findContactRequestById = (id) => ContactRequest.findById(id);

const createContactRequest = (requestData) => ContactRequest.create(requestData);

const updateContactRequestById = (id, updates) =>
    ContactRequest.findByIdAndUpdate(id, updates, { new: true, runValidators: true, context: "query" });

const deleteContactRequestById = (id) => ContactRequest.findByIdAndDelete(id);

module.exports = {
    findContactRequests,
    findContactRequestById,
    createContactRequest,
    updateContactRequestById,
    deleteContactRequestById
};
