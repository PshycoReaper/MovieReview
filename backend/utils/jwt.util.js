const jwt = require("jsonwebtoken");

const DEFAULT_EXPIRATION = "2h";

const signAuthToken = (payload, options = {}) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: DEFAULT_EXPIRATION,
        ...options
    });
};

const verifyAuthToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    signAuthToken,
    verifyAuthToken
};
