const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
    {
        requestType: {
            type: String,
            required: true,
            enum: ["review_change", "movie_request"]
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        // Título de la película relacionada:
        // - Si es "review_change": la película a la que pertenece la reseña.
        // - Si es "movie_request": la película que el usuario está solicitando.
        movieTitle: {
            type: String,
            trim: true,
            default: ""
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "in_progress", "resolved"],
            default: "pending"
        },
        // Notas internas que el admin puede dejar al procesar la petición
        adminNotes: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

contactRequestSchema.index({ status: 1 });
contactRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("contactrequests", contactRequestSchema);
