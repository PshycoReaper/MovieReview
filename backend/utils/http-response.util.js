const sendJson = (res, statusCode, body) => res.status(statusCode).json(body);

module.exports = { sendJson };
