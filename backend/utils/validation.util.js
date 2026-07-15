const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

module.exports = {
    isValidObjectId,
    isNonEmptyString
};
