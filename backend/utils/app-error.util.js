class AppError extends Error {
    constructor(statusCode, body) {
        const responseBody = typeof body === "string" ? { message: body } : body;
        const message = responseBody?.message || responseBody?.mensaje || "Error";

        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.body = responseBody;

        Error.captureStackTrace?.(this, AppError);
    }
}

module.exports = AppError;
