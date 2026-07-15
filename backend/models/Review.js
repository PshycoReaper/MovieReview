const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        idMovie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "movies",
            required: true
        },
        userName: {
            type: String,
            required: true,
            trim: true
        },
        review: {
            type: String,
            required: true,
            trim: true
        },
        grade: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    {
        timestamps: true  // Esto agrega createdAt y updatedAt automáticamente
    }
);

// Índice para mejorar el rendimiento de las consultas
reviewSchema.index({ idMovie: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model("reviews", reviewSchema);